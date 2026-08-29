using DigitalArs.Application.Interfaces;
using DigitalArs.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace DigitalArs.Infrastructure;

public static class DependencyInjection
{
  
/// Registra IRepository genérico e IUnitOfWork en el DI container como Scoped.
 
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
