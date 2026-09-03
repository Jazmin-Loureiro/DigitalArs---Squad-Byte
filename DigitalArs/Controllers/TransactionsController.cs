using DigitalArs.Application.Common;                     
using DigitalArs.Application.DTOs.Transactions;          // TransactionResponseDto, TransactionFilterDto
using DigitalArs.Application.Extensions;                // User.GetUserId()
using DigitalArs.Application.Interfaces;                // ITransactionService
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalArs.Controllers;

/// Controlador para la consulta de historial de transacciones (HU‑17).
/// resultado del servicio.

[Authorize]                                   // Requiere JWT
[ApiController]                               // Convención API
[Route("api/[controller]")]                    // Ruta base → /api/transactions
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

  
    /// Obtiene el historial de transacciones del usuario autenticado
    /// aplicando filtros y paginación (HU‑17).
   
    /// <param name="filter">Parámetros de filtrado y paginación.</param>
    /// <returns>Resultado paginado de transacciones.</returns>
    [HttpGet("me")]
    [ProducesResponseType(typeof(PagedResultDto<TransactionResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyTransactions([FromQuery] TransactionFilterDto filter)
    {
        // 1️⃣ Obtener el Id del usuario a partir del JWT
        var userId = User.GetUserId();

        // 2️⃣ Llamar al servicio que aplica filtros, ordena (descendente por fecha)
        //    y pagina los resultados.
        var result = await _transactionService.GetMyTransactionsAsync(userId, filter);

        // 3️⃣ Devolver 200 OK con el payload paginado.
        return Ok(result);
    }
}