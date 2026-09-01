// Manejo de identidades, roles y claims del usuario autenticado
using System.Security.Claims;

namespace DigitalArs.Application.Extensions
{
    // Métodos de extensión sobre ClaimsPrincipal para extraer información del token JWT 
    public static class ClaimsPrincipalExtensions
    {
        // Extrae el identificador numérico (Id) del usuario a partir de los claims del token
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var idClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? user.FindFirst("nameid")?.Value 
                          ?? user.FindFirst("sub")?.Value;

            if (int.TryParse(idClaim, out var userId))
            {
                return userId;
            }

            throw new UnauthorizedAccessException("No se pudo extraer el identificador del usuario desde el token.");
        }

        // Extrae el email del usuario autenticado a partir de los claims del token
        public static string? GetUserEmail(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Email)?.Value 
                   ?? user.FindFirst("email")?.Value;
        }

        // Extrae el rol asignado al usuario (Admin o User) a partir de los claims del token
        public static string? GetUserRole(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Role)?.Value 
                   ?? user.FindFirst("role")?.Value;
        }
    }
}