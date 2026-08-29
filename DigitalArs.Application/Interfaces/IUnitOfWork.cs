using DigitalArs.Domain.Entities;

namespace DigitalArs.Application.Interfaces;

/// Coordina múltiples repositorios bajo una única transacción lógica.
/// Los servicios de la capa de aplicación dependen de esta interfaz
/// en lugar de acceder directamente al DbContext.

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    // ──────────────────────────────────────────────────
    // Repositorios fuertemente tipados para las entidades del dominio
    // ──────────────────────────────────────────────────

    IRepository<User> Users { get; }
    IRepository<Role> Roles { get; }
    IRepository<Account> Accounts { get; }
    IRepository<Transaction> Transactions { get; }

    // ──────────────────────────────────────────────────
    // Acceso genérico para cualquier entidad del dominio
    // ──────────────────────────────────────────────────

    IRepository<T> Repository<T>() where T : class;

    // ──────────────────────────────────────────────────
    // Persistencia y control de transacciones
    // ──────────────────────────────────────────────────

    
    /// Persiste todos los cambios pendientes en la base de datos.
    /// Retorna el número de filas afectadas.
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);


    /// <summary>Inicia una transacción de base de datos explícita.</summary>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    
    /// Confirma la transacción activa y persiste todos los cambios de forma atómica.
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

   
    /// Revierte la transacción activa, deshaciendo todos los cambios no confirmados.
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
