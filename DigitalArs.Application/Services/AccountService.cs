using DigitalArs.Application.DTOs.Accounts;
using DigitalArs.Application.Interfaces;
using Mapster;

namespace DigitalArs.Application.Services;

// Servicio de aplicación que implementa la lógica para consultar cuentas
public class AccountService : IAccountService
{
    private readonly IUnitOfWork _unitOfWork;

    public AccountService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
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
}
