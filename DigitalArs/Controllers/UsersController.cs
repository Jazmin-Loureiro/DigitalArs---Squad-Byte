using System.Security.Claims;
using System.Threading.Tasks;
using DigitalArs.Application.Common;
using DigitalArs.Application.DTOs.Users;
using DigitalArs.Application.Interfaces;
using DigitalArs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalArs.Controllers;

// HU-19: Tag para agrupar los endpoints de usuarios en Swagger UI
[Tags("Users")]
[ApiController]
[Route("api/[controller]")]
[Authorize] // Exige que la petición tenga un token JWT válido
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // ==========================================
    // Ver y actualizar mis datos (Cualquier usuario autenticado)
    // ==========================================

    [HttpGet("me")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponseDto>> GetMyProfile()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var currentUserId))
        {
            return Unauthorized(new { message = "Token inválido o sin identificador de usuario." });
        }

        var profile = await _userService.GetByIdAsync(currentUserId);
        if (profile == null)
        {
            return NotFound(new { message = "Usuario no encontrado o inactivo." });
        }

        return Ok(profile);
    }

    [HttpPut("me")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponseDto>> UpdateMyProfile([FromBody] UserUpdateDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var currentUserId))
        {
            return Unauthorized(new { message = "Token inválido o sin identificador de usuario." });
        }

        var updated = await _userService.UpdateAsync(currentUserId, dto);
        if (updated == null)
        {
            return NotFound(new { message = "Usuario no encontrado o inactivo." });
        }

        return Ok(updated);
    }

    // ==========================================
    // Gestión de usuarios (Solo Admin)
    // ==========================================

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(PagedResultDto<UserResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<PagedResultDto<UserResponseDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10)
    {
        var pagedUsers = await _userService.GetPagedUsersAsync(search, page, pageSize);
        return Ok(pagedUsers);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponseDto>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = $"Usuario con id {id} no encontrado." });
        }

        return Ok(user);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UserResponseDto>> Create([FromBody] UserCreateDto dto)
    {
        var created = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponseDto>> Update(int id, [FromBody] UserUpdateDto dto)
    {
        var updated = await _userService.UpdateAsync(id, dto);
        if (updated == null)
        {
            return NotFound(new { message = $"Usuario con id {id} no encontrado." });
        }

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _userService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = $"Usuario con id {id} no encontrado." });
        }

        return NoContent();
    }
}