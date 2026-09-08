using DigitalArs.Application.Common;
using DigitalArs.Application.DTOs.Transactions;
using DigitalArs.Application.Interfaces;
using DigitalArs.Domain.Entities;

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

        var pagedTransactions = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // 5. Cargar información de los usuarios destinatarios/orígenes a través de ToAccountId
        var toAccountIds = pagedTransactions
            .Where(t => t.ToAccountId.HasValue)
            .Select(t => t.ToAccountId!.Value)
            .Distinct()
            .ToList();

        var accountUserMap = new Dictionary<int, User>();
        if (toAccountIds.Any())
        {
            var targetAccounts = await _unitOfWork.Accounts.FindAsync(a => toAccountIds.Contains(a.Id));
            var targetUserIds = targetAccounts.Select(a => a.UserId).Distinct().ToList();
            if (targetUserIds.Any())
            {
                var targetUsers = await _unitOfWork.Users.FindAsync(u => targetUserIds.Contains(u.Id));
                var userDict = targetUsers.ToDictionary(u => u.Id);

                foreach (var acc in targetAccounts)
                {
                    if (userDict.TryGetValue(acc.UserId, out var u))
                    {
                        accountUserMap[acc.Id] = u;
                    }
                }
            }
        }

        // 6. Proyección a DTO incluyendo el nombre y email del destinatario
        var items = pagedTransactions.Select(t =>
        {
            User? targetUser = t.ToAccountId.HasValue && accountUserMap.TryGetValue(t.ToAccountId.Value, out var u) ? u : null;
            string? destFullName = targetUser != null ? $"{targetUser.FirstName} {targetUser.LastName}".Trim() : null;
            string? destEmail = targetUser?.Email;

            return new TransactionResponseDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Concept = t.Concept,
                CreatedDate = t.CreatedDate,
                Type = t.Type.ToString(),
                AccountId = t.AccountId,
                ToAccountId = t.ToAccountId,
                DestinationAccountEmail = destEmail,
                DestinationUserFullName = destFullName
            };
        }).ToList();

        return new PagedResultDto<TransactionResponseDto>(items, totalItems, page, pageSize);
    }
}
