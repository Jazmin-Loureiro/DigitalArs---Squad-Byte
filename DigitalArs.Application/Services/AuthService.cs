using DigitalArs.Application.DTOs.Auth;
using DigitalArs.Application.DTOs.Users;
using DigitalArs.Application.Interfaces;
using Mapster;

namespace DigitalArs.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public AuthService(
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        // 1. Buscar usuario por Email
        var users = await _unitOfWork.Users.FindAsync(u => u.Email == request.Email);
        var user = users.FirstOrDefault();

        // 2. Validación de credenciales
        if (user == null || string.IsNullOrEmpty(user.Password) || !_passwordHasher.VerifyPassword(request.Password, user.Password))
        {
            return null;
        }

        // 3. Cargar el Rol si no vino precargado
        if (user.Role == null && user.RoleId > 0)
        {
            user.Role = await _unitOfWork.Roles.GetByIdAsync(user.RoleId);
        }

        // 4. Generar el JWT
        var (token, expiration) = _jwtProvider.GenerateToken(user);

        // 5. Mapear al DTO público
        var userDto = user.Adapt<UserResponseDto>();

        return new AuthResponseDto
        {
            Token = token,
            Expiration = expiration,
            User = userDto
        };
    }
}