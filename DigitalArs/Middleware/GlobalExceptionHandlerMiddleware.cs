using System.Net;
using System.Text.Json;
using DigitalArs.Models;

namespace DigitalArs.Middleware;

// Middleware que intercepta todas las excepciones no controladas del pipeline de ASP.NET Core
// y las transforma en una respuesta JSON con el formato unificado de HU-18:
// { statusCode, message, errors, traceId }
public class GlobalExceptionHandlerMiddleware(
    RequestDelegate next,
    ILogger<GlobalExceptionHandlerMiddleware> logger,
    IHostEnvironment env)
{
    // Opciones de serialización: camelCase para coherencia con el resto de la API
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            // El TraceIdentifier de ASP.NET Core correlaciona request ↔ log automáticamente
            var traceId = context.TraceIdentifier;

            // Registrar excepción con traceId (criterio HU-18: toda excepción se registra en log)
            // La contraseña en texto plano nunca llega aquí gracias a los DTOs y validaciones
            logger.LogError(
                ex,
                "Excepción no controlada. TraceId: {TraceId} | Path: {Path} | Method: {Method}",
                traceId,
                context.Request.Path,
                context.Request.Method);

            await WriteErrorResponseAsync(context, ex, traceId);
        }
    }

    private async Task WriteErrorResponseAsync(HttpContext context, Exception ex, string traceId)
    {
        var (statusCode, message, errors) = MapException(ex);

        // En Production, el 500 no expone stack trace (criterio HU-18)
        IEnumerable<string>? responseErrors = errors;
        if (statusCode == (int)HttpStatusCode.InternalServerError && env.IsProduction())
        {
            responseErrors = null;
        }

        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = message,
            Errors = responseErrors,
            TraceId = traceId
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonOptions));
    }

    // Mapea excepciones BCL a códigos HTTP y mensajes apropiados.
    // No se requieren excepciones de dominio propias dado que los servicios
    // ya utilizan estas excepciones de forma consistente.
    private (int statusCode, string message, IEnumerable<string>? errors) MapException(Exception ex)
    {
        return ex switch
        {
            // 404 — Recurso no encontrado (lanzado por Account/UserService)
            KeyNotFoundException =>
                ((int)HttpStatusCode.NotFound, ex.Message, null),

            // 409 — Conflicto de unicidad: email duplicado al crear usuario (HU-12)
            // UserService.CreateAsync lanza InvalidOperationException con el email en el mensaje
            InvalidOperationException ioe when ioe.Message.Contains("registrado", StringComparison.OrdinalIgnoreCase) =>
                ((int)HttpStatusCode.Conflict, ioe.Message, null),

            // 400 — Lógica de negocio inválida: saldo insuficiente, límite superado,
            //        autotransferencia, cuenta bloqueada (lanzado por AccountService)
            InvalidOperationException =>
                ((int)HttpStatusCode.BadRequest, ex.Message, null),

            // 400 — Validación de datos: contraseña actual incorrecta (lanzado por UserService)
            ArgumentException =>
                ((int)HttpStatusCode.BadRequest, ex.Message, null),

            // 401 — Sin userId en token (lanzado por ClaimsPrincipalExtensions.GetUserId)
            UnauthorizedAccessException =>
                ((int)HttpStatusCode.Unauthorized, ex.Message, null),

            // 500 — Error inesperado del servidor
            _ => (
                (int)HttpStatusCode.InternalServerError,
                env.IsProduction()
                    ? "Ocurrió un error interno. Por favor, contacte al administrador."
                    : ex.Message,
                env.IsProduction()
                    ? null
                    : new[] { ex.StackTrace ?? "Sin stack trace disponible" }
            )
        };
    }
}
