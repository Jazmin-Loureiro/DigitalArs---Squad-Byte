using System.Linq.Expressions;

namespace DigitalArs.Application.Interfaces;


/// Contrato genérico de acceso a datos para cualquier entidad del dominio.
/// La capa de aplicación depende de esta abstracción, nunca del DbContext directamente.

/// <typeparam name="T">Tipo de entidad del dominio.</typeparam>
public interface IRepository<T> where T : class
{
    ///Obtiene una entidad por su clave primaria.
    Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// Obtiene todas las entidades de la colección.
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);

    /// Filtra entidades que cumplan el predicado especificado.
    Task<IReadOnlyList<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);

    /// Agrega una nueva entidad al contexto (se persiste al llamar SaveChangesAsync)
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    void Update(T entity);
    void Delete(T entity);
}
