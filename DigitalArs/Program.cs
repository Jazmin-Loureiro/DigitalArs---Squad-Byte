// Importación del contexto de base de datos para la configuración de Entity Framework
using DigitalArs.Infrastructure.Data;

// Importación de Entity Framework Core para habilitar métodos de extensión como UseSqlServer
using Microsoft.EntityFrameworkCore;

// Importación del namespace de Infrastructure para acceder al método AddInfrastructureServices() 
using DigitalArs.Infrastructure;

// Importación de la configuración centralizada de mapeos con Mapster (HU-08)
using DigitalArs.Application.Mappings;

// Importación del core de FluentValidation para el registro automático de reglas de validación 
using FluentValidation;

// Importación de Mapster para la inyección de dependencias de mapeo objeto a objeto
using Mapster;

// Importación del filtro middleware para autovalidar DTOs en los controladores y retornar 400 Bad Request 
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

// Importación del contrato de hashing de contraseñas (IPasswordHasher) desde la capa Application 
using DigitalArs.Application.Interfaces;

// Importación de la implementación concreta con BCrypt (PasswordHasher) desde la capa Infrastructure 
using DigitalArs.Infrastructure.Services;

namespace DigitalArs
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Registro de DigitalArsDbContext en el contenedor de inyección de dependencias (DI) con SQL Server
            builder.Services.AddDbContext<DigitalArsDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DigitalArsDB")));

            // Registro de controladores de la API
            builder.Services.AddControllers();

            // Configuración de OpenAPI para documentación
            builder.Services.AddOpenApi();

            // Registro de repositorios genéricos y Unit of Work 
            builder.Services.AddInfrastructureServices();
            
            // 1. Configurar y registrar mapeos centralizados de Mapster 
            MappingConfig.RegisterMappings();
            builder.Services.AddMapster();

            // 2. Escaneo y registro de todos los validadores de FluentValidation en Application 
            builder.Services.AddValidatorsFromAssemblyContaining<DigitalArs.Application.DTOs.Auth.LoginRequestDto>();

            // 3. Habilitación de la intercepción y validación automática de payloads entrantes 
            builder.Services.AddFluentValidationAutoValidation();

            // Registro del servicio de hashing de contraseñas con ciclo de vida Scoped
            builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

            var app = builder.Build();

            // Configuración del pipeline de solicitudes HTTP
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