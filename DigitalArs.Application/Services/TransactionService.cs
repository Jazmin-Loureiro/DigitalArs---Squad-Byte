using DigitalArs.Application.Common;
using DigitalArs.Application.DTOs.Transactions;
using DigitalArs.Application.Interfaces;

namespace DigitalArs.Application.Services;

/// Servicio para la consulta del historial de transacciones con filtros y paginación (HU-17).
public class TransactionService : ITransactionService
{
    private readonly IUnitOfWork _unitOfWork;

    public TransactionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResultDto<TransactionResponseDto>> GetMyTransactionsAsync(int userId, TransactionFilterDto filter)
    {
        // 1. Obtener la cuenta asociada al usuario autenticado
        var userAccounts = await _unitOfWork.Accounts.FindAsync(a => a.UserId == userId);
        var account = userAccounts.FirstOrDefault()
            ?? throw new KeyNotFoundException("No se encontró una cuenta asociada al usuario autenticado.");

        // 2. Obtener los movimientos de la cuenta
        var transactions = await _unitOfWork.Transactions.FindAsync(t => t.AccountId == account.Id);

        var query = transactions.AsEnumerable();

        // 3. Aplicar filtros opcionales
        if (filter.Type.HasValue)
        {
            query = query.Where(t => t.Type == filter.Type.Value);
        }

        if (filter.FromDate.HasValue)
        {
            query = query.Where(t => t.CreatedDate >= filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
            query = query.Where(t => t.CreatedDate <= filter.ToDate.Value);
        }

        if (filter.MinAmount.HasValue)
        {
            query = query.Where(t => t.Amount >= filter.MinAmount.Value);
        }

        if (filter.MaxAmount.HasValue)
        {
            query = query.Where(t => t.Amount <= filter.MaxAmount.Value);
        }

        // 4. Orden descendente por fecha de creación (Criterio de aceptación HU-17)
        query = query.OrderByDescending(t => t.CreatedDate);

        var totalItems = query.Count();

        var page = filter.Page < 1 ? 1 : filter.Page;
        var pageSize = filter.PageSize < 1 ? 10 : filter.PageSize;

        // 5. Proyección a DTO para optimizar y evitar N+1
        var items = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Concept = t.Concept,
                CreatedDate = t.CreatedDate,
                Type = t.Type.ToString(),
                AccountId = t.AccountId,
                ToAccountId = t.ToAccountId
            })
            .ToList();

        return new PagedResultDto<TransactionResponseDto>(items, totalItems, page, pageSize);
    }
}
