using DigitalArs.Application.Interfaces;

namespace DigitalArs.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password)
    {
        // Genera el hash con un salt aleatorio integrado por defecto (WorkFactor 11 estándar de BCrypt)
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        // Compara el texto plano ingresado contra el hash almacenado
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}