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
}
