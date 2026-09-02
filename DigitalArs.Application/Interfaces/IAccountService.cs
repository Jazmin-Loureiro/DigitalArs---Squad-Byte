using DigitalArs.Application.DTOs.Accounts;

namespace DigitalArs.Application.Interfaces;

// Interfaz para la gestión y consulta de cuentas de usuario
public interface IAccountService
{
    Task<AccountResponseDto?> GetMyAccountAsync(int userId);

    // Obtiene una cuenta por su identificador único (Solo administración)
    Task<AccountResponseDto?> GetAccountByIdAsync(int accountId);
}

