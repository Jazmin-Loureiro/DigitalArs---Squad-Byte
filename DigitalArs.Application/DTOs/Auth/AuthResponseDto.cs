using DigitalArs.Application.DTOs.Users;

namespace DigitalArs.Application.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public UserResponseDto User { get; set; } = null!;
}