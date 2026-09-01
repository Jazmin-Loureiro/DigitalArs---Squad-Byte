// Importación del espacio de nombres donde está definido DigitalArsDbContext
using DigitalArs.Infrastructure.Data;
// Importación de Entity Framework Core para habilitar extensiones como UseSqlServer
using Microsoft.EntityFrameworkCore;
using DigitalArs.Infrastructure;
using DigitalArs.Application.Mappings;
using FluentValidation;
using Mapster;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

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
            
            // 1. Configurar Mapeos de Mapster
            MappingConfig.RegisterMappings();
            builder.Services.AddMapster();

            // 2. Registrar Validadores de FluentValidation del proyecto Application
            builder.Services.AddValidatorsFromAssemblyContaining<DigitalArs.Application.DTOs.Auth.LoginRequestDto>();

            // 3. Habilitar Auto-Validación en los controladores
            builder.Services.AddFluentValidationAutoValidation();

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
