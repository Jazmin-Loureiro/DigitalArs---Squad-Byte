using DigitalArs.Application.DTOs.Auth;
using DigitalArs.Application.Interfaces;
using DigitalArs.Application.Services;
using DigitalArs.Domain.Entities;
using Moq;
using System.Linq.Expressions;
using Xunit;

namespace DigitalArs.Application.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IPasswordHasher> _mockPasswordHasher;
    private readonly Mock<IJwtProvider> _mockJwtProvider;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockPasswordHasher = new Mock<IPasswordHasher>();
        _mockJwtProvider = new Mock<IJwtProvider>();

        _authService = new AuthService(
            _mockUnitOfWork.Object,
            _mockPasswordHasher.Object,
            _mockJwtProvider.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponseDto()
    {
        // Arrange
        var request = new LoginRequestDto { Email = "test@test.com", Password = "Password123" };
        var user = new User { Id = 1, Email = "test@test.com", Password = "hashed_password", IsActive = true, RoleId = 1 };

        _mockUnitOfWork.Setup(u => u.Users.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
            .ReturnsAsync(new List<User> { user });

        _mockPasswordHasher.Setup(p => p.VerifyPassword(request.Password, user.Password))
            .Returns(true);

        _mockUnitOfWork.Setup(u => u.Roles.GetByIdAsync(user.RoleId))
            .ReturnsAsync(new Role { Id = 1, Name = "Admin" });

        _mockJwtProvider.Setup(j => j.GenerateToken(It.IsAny<User>()))
            .Returns(("mock_token", DateTime.UtcNow.AddHours(1)));

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("mock_token", result.Token);
        Assert.NotNull(result.User);
        Assert.Equal(user.Email, result.User.Email);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ReturnsNull()
    {
        // Arrange
        var request = new LoginRequestDto { Email = "test@test.com", Password = "WrongPassword" };
        var user = new User { Id = 1, Email = "test@test.com", Password = "hashed_password", IsActive = true };

        _mockUnitOfWork.Setup(u => u.Users.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
            .ReturnsAsync(new List<User> { user });

        _mockPasswordHasher.Setup(p => p.VerifyPassword(request.Password, user.Password))
            .Returns(false); // Simula contraseña incorrecta

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_InactiveUser_ReturnsNull()
    {
        // Arrange
        var request = new LoginRequestDto { Email = "test@test.com", Password = "Password123" };
        var user = new User { Id = 1, Email = "test@test.com", Password = "hashed_password", IsActive = false }; // Usuario inactivo

        _mockUnitOfWork.Setup(u => u.Users.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
            .ReturnsAsync(new List<User> { user });

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Null(result);
        // Verificamos que el Hasher nunca fue llamado porque cortocircuita por inactivo
        _mockPasswordHasher.Verify(p => p.VerifyPassword(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}
