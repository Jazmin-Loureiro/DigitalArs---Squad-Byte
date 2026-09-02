using DigitalArs.Application.DTOs.Accounts;
using DigitalArs.Application.Interfaces;
using DigitalArs.Application.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalArs.Controllers;

// Controlador para la gestión de cuentas y consultas de saldo
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    // GET: api/accounts/me - Permite al usuario autenticado ver el estado y saldo de su cuenta
    [HttpGet("me")]
    [ProducesResponseType(typeof(AccountResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMyAccount()
    {
        var userId = User.GetUserId();

        var account = await _accountService.GetMyAccountAsync(userId);
        if (account == null)
            return NotFound(new { message = "Cuenta no encontrada para el usuario actual." });

        return Ok(account);
    }

    // GET: api/accounts/{id} - Permite a un administrador consultar una cuenta específica por su ID
    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AccountResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAccountById(int id)
    {
        var account = await _accountService.GetAccountByIdAsync(id);
        if (account == null)
            return NotFound(new { message = "Cuenta no encontrada." });

        return Ok(account);
    }

    // POST: api/accounts/deposit : Deposita dinero en la cuenta del usuario autenticado
    [HttpPost("deposit")]
    [ProducesResponseType(typeof(DepositResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deposit([FromBody] DepositRequestDto request)
    {
        var userId = User.GetUserId();

        try
        {
            var result = await _accountService.DepositAsync(userId, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

