using DigitalArs.Application.DTOs.Auth;

namespace DigitalArs.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
}