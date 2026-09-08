using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace DigitalArs.OpenApi;

// HU-19: Transformer que inyecta la definición de seguridad Bearer JWT en el documento OpenAPI.
// Esto habilita el botón "Authorize" en Swagger UI para que los desarrolladores frontend
// puedan probar endpoints protegidos directamente desde el navegador.
internal sealed class BearerSecuritySchemeTransformer(
    IAuthenticationSchemeProvider authenticationSchemeProvider) : IOpenApiDocumentTransformer
{
    public async Task TransformAsync(
        OpenApiDocument document,
        OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken)
    {
        // 1. Verificar que el esquema Bearer esté registrado en el pipeline de autenticación
        var authSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
        if (!authSchemes.Any(s => s.Name == "Bearer"))
            return;

        // 2. Agregar metadata descriptiva de la API
        document.Info = new OpenApiInfo
        {
            Title = "DigitalArs API",
            Version = "v1",
            Description = "API de la billetera virtual DigitalArs — Gestión de usuarios, cuentas, " +
                          "transacciones y autenticación JWT."
        };

        // 3. Registrar el esquema de seguridad Bearer JWT en los componentes del documento
        var securitySchemeId = "Bearer";

        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();

        document.Components.SecuritySchemes[securitySchemeId] = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Ingrese el token JWT obtenido del endpoint POST /api/auth/login. " +
                          "Ejemplo: eyJhbGciOiJIUzI1NiIs..."
        };

        // 4. Requisito de seguridad que referencia al esquema Bearer (OpenApi 2.x)
        var securityRequirement = new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference(securitySchemeId, document)] = new List<string>()
        };

        // 4.1 Requisito a nivel documento (global)
        document.Security ??= new List<OpenApiSecurityRequirement>();
        document.Security.Add(securityRequirement);

        // 4.2 Requisito a nivel de operación individual (garantiza que Swagger UI envíe el header Authorization)
        if (document.Paths != null)
        {
            foreach (var pathItem in document.Paths.Values)
            {
                if (pathItem.Operations == null) continue;

                foreach (var operation in pathItem.Operations.Values)
                {
                    operation.Security ??= new List<OpenApiSecurityRequirement>();
                    operation.Security.Add(securityRequirement);
                }
            }
        }
    }
}
