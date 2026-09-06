using DigitalArs.Application.DTOs.Accounts;
using DigitalArs.Application.Interfaces;
using DigitalArs.Application.Services;
using DigitalArs.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Linq.Expressions;
using Xunit;

namespace DigitalArs.Application.Tests.Services;

public class AccountServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly AccountService _accountService;

    public AccountServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockUnitOfWork.Setup(u => u.Transactions.AddAsync(It.IsAny<Transaction>())).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.Accounts.Update(It.IsAny<Account>()));

        _mockConfiguration = new Mock<IConfiguration>();

        SetupConfiguration("DepositSettings:MaxAmountPerOperation", 500000m);
        SetupConfiguration("TransferSettings:MaxAmountPerOperation", 300000m);

        _accountService = new AccountService(
            _mockUnitOfWork.Object,
            _mockConfiguration.Object);
    }

    private void SetupConfiguration(string key, decimal value)
    {
        var configurationSectionMock = new Mock<IConfigurationSection>();
        configurationSectionMock.Setup(s => s.Value).Returns(value.ToString());
        
        _mockConfiguration.Setup(c => c.GetSection(key)).Returns(configurationSectionMock.Object);
        // Map IConfiguration.GetValue as we might need a workaround for extension methods
        // But typically GetValue looks up the section. Let's mock GetSection.
    }

    [Fact]
    public async Task DepositAsync_ValidAmount_ReturnsDepositResponseDto()
    {
        // Arrange
        var userId = 1;
        var request = new DepositRequestDto { Amount = 1000m, Concept = "Depósito Test" };
        var account = new Account { Id = 1, UserId = userId, Money = 5000m, IsBlocked = false };

        _mockUnitOfWork.Setup(u => u.Accounts.FindAsync(It.IsAny<Expression<Func<Account, bool>>>()))
            .ReturnsAsync(new List<Account> { account });

        // _configuration.GetValue is an extension method, difficult to mock directly with Moq. 
        // We will just let it return the default value 500000m since we are not setting it up strictly or we mock GetSection if needed.
        
        // Act
        var result = await _accountService.DepositAsync(userId, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(6000m, result.NewBalance);
        _mockUnitOfWork.Verify(u => u.BeginTransactionAsync(), Times.Once);
        _mockUnitOfWork.Verify(u => u.Accounts.Update(It.IsAny<Account>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.Transactions.AddAsync(It.IsAny<Transaction>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(), Times.Once);
    }

    [Fact]
    public async Task DepositAsync_AmountExceedsLimit_ThrowsInvalidOperationException()
    {
        // Arrange
        var userId = 1;
        var request = new DepositRequestDto { Amount = 1000000m }; // Supera default de 500k
        var account = new Account { Id = 1, UserId = userId, Money = 5000m, IsBlocked = false };

        _mockUnitOfWork.Setup(u => u.Accounts.FindAsync(It.IsAny<Expression<Func<Account, bool>>>()))
            .ReturnsAsync(new List<Account> { account });

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _accountService.DepositAsync(userId, request));
    }

    [Fact]
    public async Task TransferAsync_ValidTransfer_ReturnsTransferResponseDto()
    {
        // Arrange
        var userId = 1;
        var request = new TransferRequestDto { ToAccountId = 2, Amount = 1000m, Concept = "Transferencia Test" };
        
        var sourceAccount = new Account { Id = 1, UserId = userId, Money = 5000m, IsBlocked = false };
        var destinationAccount = new Account { Id = 2, UserId = 2, Money = 2000m, IsBlocked = false };

        _mockUnitOfWork.Setup(u => u.Accounts.FindAsync(It.IsAny<Expression<Func<Account, bool>>>()))
            .ReturnsAsync(new List<Account> { sourceAccount }); // Para cuenta origen

        _mockUnitOfWork.Setup(u => u.Accounts.GetByIdAsync(request.ToAccountId))
            .ReturnsAsync(destinationAccount); // Para cuenta destino

        // Act
        var result = await _accountService.TransferAsync(userId, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(4000m, result.NewBalance); // 5000 - 1000
        Assert.Equal(3000m, destinationAccount.Money); // 2000 + 1000
        
        _mockUnitOfWork.Verify(u => u.BeginTransactionAsync(), Times.Once);
        _mockUnitOfWork.Verify(u => u.Accounts.Update(sourceAccount), Times.Once);
        _mockUnitOfWork.Verify(u => u.Accounts.Update(destinationAccount), Times.Once);
        _mockUnitOfWork.Verify(u => u.Transactions.AddAsync(It.IsAny<Transaction>()), Times.Exactly(2)); // Out e In
        _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(), Times.Once);
    }

    [Fact]
    public async Task TransferAsync_InsufficientFunds_ThrowsInvalidOperationException()
    {
        // Arrange
        var userId = 1;
        var request = new TransferRequestDto { ToAccountId = 2, Amount = 6000m }; // Origen tiene 5000
        
        var sourceAccount = new Account { Id = 1, UserId = userId, Money = 5000m, IsBlocked = false };
        var destinationAccount = new Account { Id = 2, UserId = 2, Money = 2000m, IsBlocked = false };

        _mockUnitOfWork.Setup(u => u.Accounts.FindAsync(It.IsAny<Expression<Func<Account, bool>>>()))
            .ReturnsAsync(new List<Account> { sourceAccount });

        _mockUnitOfWork.Setup(u => u.Accounts.GetByIdAsync(request.ToAccountId))
            .ReturnsAsync(destinationAccount);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _accountService.TransferAsync(userId, request));
    }

    [Fact]
    public async Task TransferAsync_DestinationAccountNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var userId = 1;
        var request = new TransferRequestDto { ToAccountId = 999, Amount = 1000m };
        
        var sourceAccount = new Account { Id = 1, UserId = userId, Money = 5000m, IsBlocked = false };

        _mockUnitOfWork.Setup(u => u.Accounts.FindAsync(It.IsAny<Expression<Func<Account, bool>>>()))
            .ReturnsAsync(new List<Account> { sourceAccount });

        _mockUnitOfWork.Setup(u => u.Accounts.GetByIdAsync(request.ToAccountId))
            .ReturnsAsync((Account?)null); // No existe destino

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _accountService.TransferAsync(userId, request));
    }

    [Fact]
    public async Task TransferAsync_SelfTransfer_ThrowsInvalidOperationException()
    {
        // Arrange
        var userId = 1;
        var sourceAccountId = 1;
        var request = new TransferRequestDto { ToAccountId = sourceAccountId, Amount = 1000m };
        
        var sourceAccount = new Account { Id = sourceAccountId, UserId = userId, Money = 5000m, IsBlocked = false };

        _mockUnitOfWork.Setup(u => u.Accounts.FindAsync(It.IsAny<Expression<Func<Account, bool>>>()))
            .ReturnsAsync(new List<Account> { sourceAccount });

        _mockUnitOfWork.Setup(u => u.Accounts.GetByIdAsync(request.ToAccountId))
            .ReturnsAsync(sourceAccount); // El destino es el mismo

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _accountService.TransferAsync(userId, request));
    }

    [Fact]
    public async Task TransferAsync_DatabaseError_CallsRollback()
    {
        // Arrange
        var userId = 1;
        var request = new TransferRequestDto { ToAccountId = 2, Amount = 1000m, Concept = "Test Error" };
        
        var sourceAccount = new Account { Id = 1, UserId = userId, Money = 5000m, IsBlocked = false };
        var destinationAccount = new Account { Id = 2, UserId = 2, Money = 2000m, IsBlocked = false };

        _mockUnitOfWork.Setup(u => u.Accounts.FindAsync(It.IsAny<Expression<Func<Account, bool>>>()))
            .ReturnsAsync(new List<Account> { sourceAccount });

        _mockUnitOfWork.Setup(u => u.Accounts.GetByIdAsync(request.ToAccountId))
            .ReturnsAsync(destinationAccount);

        // Simulamos un fallo al guardar la transacción
        _mockUnitOfWork.Setup(u => u.Transactions.AddAsync(It.IsAny<Transaction>()))
            .ThrowsAsync(new Exception("Database connection lost"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _accountService.TransferAsync(userId, request));
        
        // Verificamos que se haya intentado comenzar la transacción y hecho el rollback
        _mockUnitOfWork.Verify(u => u.BeginTransactionAsync(), Times.Once);
        _mockUnitOfWork.Verify(u => u.RollbackTransactionAsync(), Times.Once);
        _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(), Times.Never);
    }
}
