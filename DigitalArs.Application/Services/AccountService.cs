using DigitalArs.Application.DTOs.Accounts;
using DigitalArs.Application.Interfaces;
using DigitalArs.Domain.Entities;
using Mapster;
using Microsoft.Extensions.Configuration;

namespace DigitalArs.Application.Services;

// Servicio de aplicación que implementa la lógica para consultar cuentas y depositar dinero
public class AccountService : IAccountService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;

    public AccountService(IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
    }

    // Busca y mapea la cuenta asociada al ID del usuario
    public async Task<AccountResponseDto?> GetMyAccountAsync(int userId)
    {
        var accounts = await _unitOfWork.Accounts.FindAsync(a => a.UserId == userId);
        var account = accounts.FirstOrDefault();

        if (account == null)
            return null;

        return account.Adapt<AccountResponseDto>();
    }

    // Busca y mapea la cuenta por su ID primario
    public async Task<AccountResponseDto?> GetAccountByIdAsync(int accountId)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(accountId);

        if (account == null)
            return null;

        return account.Adapt<AccountResponseDto>();
    }

    // HU-15: Deposita dinero en la cuenta del usuario autenticado
    public async Task<DepositResponseDto> DepositAsync(int userId, DepositRequestDto request)
    {
        // 1. Obtener la cuenta del usuario
        var accounts = await _unitOfWork.Accounts.FindAsync(a => a.UserId == userId);
        var account = accounts.FirstOrDefault()
            ?? throw new KeyNotFoundException("No se encontró una cuenta asociada al usuario.");

        // 2. Validar que la cuenta no esté bloqueada
        if (account.IsBlocked)
            throw new InvalidOperationException("La cuenta se encuentra bloqueada. No es posible realizar depósitos.");

        // 3. Validar límite máximo por operación (configurable desde appsettings)
        var maxAmount = _configuration.GetValue<decimal>("DepositSettings:MaxAmountPerOperation", 500000m);
        if (request.Amount > maxAmount)
            throw new InvalidOperationException($"El monto supera el límite máximo por operación (${maxAmount:N2}).");

        // 4. Operación atómica con Unit of Work
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 4a. Actualizar saldo
            account.Money += request.Amount;
            _unitOfWork.Accounts.Update(account);

            // 4b. Registrar la transacción de tipo Deposit
            var transaction = new Transaction
            {
                AccountId = account.Id,
                Amount = request.Amount,
                Concept = string.IsNullOrWhiteSpace(request.Concept) ? "Depósito" : request.Concept,
                Type = TransactionType.Deposit,
                CreatedDate = DateTime.UtcNow
            };
            await _unitOfWork.Transactions.AddAsync(transaction);

            // 4c. Confirmar la transacción de base de datos
            await _unitOfWork.CommitTransactionAsync();

            // 5. Retornar respuesta
            return new DepositResponseDto
            {
                TransactionId = transaction.Id,
                Amount = request.Amount,
                NewBalance = account.Money,
                Date = transaction.CreatedDate,
                Message = "Depósito realizado exitosamente."
            };
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // HU-16: Transfiere dinero de la cuenta del usuario autenticado a otra cuenta
    public async Task<TransferResponseDto> TransferAsync(int userId, TransferRequestDto request)
    {
        // 1. Obtener la cuenta origen del usuario autenticado
        var sourceAccounts = await _unitOfWork.Accounts.FindAsync(a => a.UserId == userId);
        var sourceAccount = sourceAccounts.FirstOrDefault()
            ?? throw new KeyNotFoundException("No se encontró una cuenta asociada al usuario.");

        // 2. Obtener la cuenta destino
        var destinationAccount = await _unitOfWork.Accounts.GetByIdAsync(request.ToAccountId)
            ?? throw new KeyNotFoundException($"No se encontró la cuenta destino con ID {request.ToAccountId}.");

        // 3. Validar que no se transfiera a sí mismo
        if (sourceAccount.Id == destinationAccount.Id)
            throw new InvalidOperationException("No es posible realizar una transferencia a la misma cuenta.");

        // 4. Validar que la cuenta origen no esté bloqueada
        if (sourceAccount.IsBlocked)
            throw new InvalidOperationException("La cuenta de origen se encuentra bloqueada. No es posible realizar transferencias.");

        // 5. Validar que la cuenta destino no esté bloqueada
        if (destinationAccount.IsBlocked)
            throw new InvalidOperationException("La cuenta de destino se encuentra bloqueada. No es posible recibir transferencias.");

        // 6. Validar límite máximo por operación (configurable desde appsettings)
        var maxAmount = _configuration.GetValue<decimal>("TransferSettings:MaxAmountPerOperation", 300000m);
        if (request.Amount > maxAmount)
            throw new InvalidOperationException($"El monto supera el límite máximo por transferencia (${maxAmount:N2}).");

        // 7. Validar saldo suficiente en cuenta origen
        if (sourceAccount.Money < request.Amount)
            throw new InvalidOperationException($"Saldo insuficiente. Saldo disponible: ${sourceAccount.Money:N2}.");

        // 8. Operación atómica con Unit of Work
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var now = DateTime.UtcNow;
            var concept = string.IsNullOrWhiteSpace(request.Concept) ? "Transferencia" : request.Concept;

            // 8a. Actualizar saldos de ambas cuentas
            sourceAccount.Money -= request.Amount;
            destinationAccount.Money += request.Amount;
            _unitOfWork.Accounts.Update(sourceAccount);
            _unitOfWork.Accounts.Update(destinationAccount);

            // 8b. Registrar transacción de débito en cuenta origen (TransferOut)
            var outTransaction = new Transaction
            {
                AccountId = sourceAccount.Id,
                ToAccountId = destinationAccount.Id,
                Amount = request.Amount,
                Concept = concept,
                Type = TransactionType.TransferOut,
                CreatedDate = now
            };
            await _unitOfWork.Transactions.AddAsync(outTransaction);

            // 8c. Registrar transacción de crédito en cuenta destino (TransferIn)
            var inTransaction = new Transaction
            {
                AccountId = destinationAccount.Id,
                ToAccountId = sourceAccount.Id,
                Amount = request.Amount,
                Concept = concept,
                Type = TransactionType.TransferIn,
                CreatedDate = now
            };
            await _unitOfWork.Transactions.AddAsync(inTransaction);

            // 8d. Confirmar la transacción de base de datos
            await _unitOfWork.CommitTransactionAsync();

            // 9. Retornar respuesta
            return new TransferResponseDto
            {
                OutTransactionId = outTransaction.Id,
                InTransactionId = inTransaction.Id,
                Amount = request.Amount,
                NewBalance = sourceAccount.Money,
                FromAccountId = sourceAccount.Id,
                ToAccountId = destinationAccount.Id,
                Date = now,
                Message = "Transferencia realizada exitosamente."
            };
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
