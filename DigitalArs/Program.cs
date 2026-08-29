// Importación del espacio de nombres donde está definido DigitalArsDbContext
using DigitalArs.Infrastructure.Data;
// Importación de Entity Framework Core para habilitar extensiones como UseSqlServer
using Microsoft.EntityFrameworkCore;
using DigitalArs.Infrastructure;

namespace DigitalArs
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Registro de DigitalArsDbContext en el contenedor de inyección de dependencias (DI).
            // Se configura para usar el proveedor de SQL Server y se obtiene la connection a la base de datos.
            builder.Services.AddDbContext<DigitalArsDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DigitalArsDB")));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            // Registro de IRepository e IUnitOfWork
            builder.Services.AddInfrastructureServices();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "DigitalArs V1"));
            }


            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
