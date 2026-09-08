using DigitalArs.Application.DTOs.Accounts;

namespace DigitalArs.Application.Interfaces;

// Interfaz para la gestión y consulta de cuentas de usuario
public interface IAccountService
{
    Task<AccountResponseDto?> GetMyAccountAsync(int userId);

    // Obtiene una cuenta por su identificador único (Solo administración)
    Task<AccountResponseDto?> GetAccountByIdAsync(int accountId);

    //  Deposita dinero en la cuenta del usuario autenticado
    Task<DepositResponseDto> DepositAsync(int userId, DepositRequestDto request);

    //  Transfiere dinero desde la cuenta del usuario autenticado a otra cuenta
    Task<TransferResponseDto> TransferAsync(int userId, TransferRequestDto request);
}

