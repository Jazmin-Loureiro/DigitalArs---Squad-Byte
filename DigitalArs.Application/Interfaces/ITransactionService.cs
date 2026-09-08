using DigitalArs.Application.Common;
using DigitalArs.Application.DTOs.Transactions;

namespace DigitalArs.Application.Interfaces;


/// Contrato de servicio para operaciones de consulta y gestión de transacciones (HU-17).

public interface ITransactionService
{
    /// Consulta el historial de transacciones del usuario autenticado con filtros y paginación.
    Task<PagedResultDto<TransactionResponseDto>> GetMyTransactionsAsync(int userId, TransactionFilterDto filter);
}
