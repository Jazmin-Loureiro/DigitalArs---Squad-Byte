// Codificación de texto a bytes para la clave criptográfica del JWT
using System.Text;

// Importación del contexto de base de datos para la configuración de Entity Framework
using DigitalArs.Infrastructure.Data;

// Importación de Entity Framework Core para habilitar métodos de extensión como UseSqlServer
using Microsoft.EntityFrameworkCore;

// Importación del namespace de Infrastructure para acceder al método AddInfrastructureServices()
using DigitalArs.Infrastructure;

// Importación de la configuración centralizada de mapeos con Mapster
using DigitalArs.Application.Mappings;

// Importación del core de FluentValidation para el registro automático de reglas de validación
using FluentValidation;

// Importación de Mapster para la inyección de dependencias de mapeo objeto a objeto
using Mapster;

// Importación del filtro middleware para autovalidar DTOs en los controladores y retornar 400 Bad Request
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

// Importación del middleware de manejo global de excepciones (HU-18)
using DigitalArs.Middleware;

// Importación de las interfaces de servicios de la capa Application (IPasswordHasher, IJwtProvider, IAuthService)
using DigitalArs.Application.Interfaces;

// Importación de los servicios concretos de Application (AuthService)
using DigitalArs.Application.Services;

// Importación de los servicios concretos de Infrastructure (PasswordHasher, JwtProvider)
using DigitalArs.Infrastructure.Services;

// Soporte de esquemas de autenticación Bearer JWT en ASP.NET Core
using Microsoft.AspNetCore.Authentication.JwtBearer;

// Herramientas de validación y claves simétricas para tokens JWT
using Microsoft.IdentityModel.Tokens;

// Clases para construir políticas de autorización global
using Microsoft.AspNetCore.Authorization;

// Filtros para aplicar requisitos de autorización a nivel de controlador
using Microsoft.AspNetCore.Mvc.Authorization;

namespace DigitalArs
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Registro de DigitalArsDbContext en el contenedor de inyección de dependencias (DI) con SQL Server
            builder.Services.AddDbContext<DigitalArsDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DigitalArsDB")));

            // Registro de controladores aplicando [Authorize] por defecto de forma global
            builder.Services.AddControllers(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                options.Filters.Add(new AuthorizeFilter(policy));
            });

            // Configuración de OpenAPI para documentación y exploración de endpoints
            builder.Services.AddOpenApi();

            // 2. Registro de repositorios genéricos y Unit of Work
            builder.Services.AddInfrastructureServices();

            // 3. Configurar y registrar mapeos centralizados de Mapster
            MappingConfig.RegisterMappings();
            builder.Services.AddMapster();

            // 4. Escaneo y registro de todos los validadores de FluentValidation en Application
            builder.Services.AddValidatorsFromAssemblyContaining<DigitalArs.Application.DTOs.Auth.LoginRequestDto>();

            // 5. Habilitación de la intercepción y validación automática de payloads entrantes
            builder.Services.AddFluentValidationAutoValidation();

            // 6. Registro del servicio de hashing de contraseñas
            builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

            // 7. Registro de servicios de generación de tokens y autenticación
            builder.Services.AddScoped<IJwtProvider, JwtProvider>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IAccountService, AccountService>();

            // 8. Registro del servicio de gestión y CRUD de usuarios
            builder.Services.AddScoped<IUserService, UserService>();

            // 9. Configuración del esquema de autenticación JWT Bearer
            var secretKey = builder.Configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("JwtSettings:SecretKey no está configurada en appsettings.json");

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JwtSettings:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            // 10. Configuración de CORS desacoplada mediante appsettings.json
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? new[] { "http://localhost:5173" };

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("FrontendPolicy", policy =>
                {
                    policy
                        .WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configuración del pipeline de solicitudes HTTP

            // HU-18: Debe ser el PRIMERO en el pipeline para capturar cualquier excepción
            // que ocurra en middlewares o controladores posteriores
            app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "DigitalArs V1"));
            }

            app.UseHttpsRedirection();

            // Permitir solicitudes desde el frontend React
            app.UseCors("FrontendPolicy");

            // Middleware de autenticación (identifica quién es el usuario mediante el token)
            // DEBE ejecutarse obligatoriamente antes de UseAuthorization
            app.UseAuthentication();

            // Middleware de autorización (comprueba si el usuario tiene permisos o el rol requerido)
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}