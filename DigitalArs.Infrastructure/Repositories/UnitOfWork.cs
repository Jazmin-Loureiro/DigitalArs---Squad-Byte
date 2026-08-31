using DigitalArs.Application.Interfaces;
using DigitalArs.Domain.Entities;
using DigitalArs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace DigitalArs.Infrastructure.Repositories;


/// Implementación de IUnitOfWork para la gestión del DbContext y transacciones de base de datos.

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly DigitalArsDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new();
    private IDbContextTransaction? _currentTransaction;
    private bool _disposed = false;

    private IRepository<User>? _users;
    private IRepository<Role>? _roles;
    private IRepository<Account>? _accounts;
    private IRepository<Transaction>? _transactions;

    public IRepository<User> Users => _users ??= Repository<User>();
    public IRepository<Role> Roles => _roles ??= Repository<Role>();
    public IRepository<Account> Accounts => _accounts ??= Repository<Account>();
    public IRepository<Transaction> Transactions => _transactions ??= Repository<Transaction>();

    public UnitOfWork(DigitalArsDbContext context)
    {
        _context = context;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        var type = typeof(T);
        if (!_repositories.TryGetValue(type, out var repo))
        {
            repo = new Repository<T>(_context);
            _repositories[type] = repo;
        }
        return (IRepository<T>)repo;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction is not null)
            throw new InvalidOperationException("Ya existe una transacción activa.");

        _currentTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction is null)
            throw new InvalidOperationException("No hay ninguna transacción activa para confirmar.");

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
            await _currentTransaction.CommitAsync(cancellationToken);
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            await DisposeTransactionAsync();
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction is null)
            throw new InvalidOperationException("No hay ninguna transacción activa para revertir.");

        try
        {
            await _currentTransaction.RollbackAsync(cancellationToken);
        }
        finally
        {
            await DisposeTransactionAsync();
        }
    }

    private async Task DisposeTransactionAsync()
    {
        if (_currentTransaction is not null)
        {
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _currentTransaction?.Dispose();
            _context.Dispose();
            _disposed = true;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (!_disposed)
        {
            if (_currentTransaction is not null)
                await _currentTransaction.DisposeAsync();

            await _context.DisposeAsync();
            _disposed = true;
        }
    }
}
