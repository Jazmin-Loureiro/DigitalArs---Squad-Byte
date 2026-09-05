using DigitalArs.Application.DTOs.Auth;
using DigitalArs.Application.Interfaces;
using DigitalArs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace DigitalArs.Controllers;

// HU-19: Tag para agrupar los endpoints de autenticación en Swagger UI
[Tags("Auth")]
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // Endpoint público para autenticación y obtención de JWT
    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var response = await _authService.LoginAsync(request);

        if (response == null)
        {
            // Mensaje genérico por seguridad (Criterio de aceptación HU-10)
            return Unauthorized(new { message = "Credenciales inválidas." });
        }

        return Ok(response);
    }
}