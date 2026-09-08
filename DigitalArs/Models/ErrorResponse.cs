namespace DigitalArs.Models;

// Formato único de respuesta de error para todos los endpoints de la API.
// Criterio de aceptación HU-18: { statusCode, message, errors, traceId }
public sealed record ErrorResponse
{
    // Código HTTP de la respuesta (400, 401, 403, 404, 500…).
    public int StatusCode { get; init; }

    // Mensaje descriptivo del error.
    public string Message { get; init; } = string.Empty;

    // Lista de errores detallados. Null cuando no aplica (ej: 404, 500).
    // Se puebla cuando hay múltiples validaciones o mensajes específicos.
    public IEnumerable<string>? Errors { get; init; }

    // Identificador de la solicitud para correlacionar con los logs del servidor.
    // Corresponde a HttpContext.TraceIdentifier generado por ASP.NET Core.
    public string TraceId { get; init; } = string.Empty;
}
