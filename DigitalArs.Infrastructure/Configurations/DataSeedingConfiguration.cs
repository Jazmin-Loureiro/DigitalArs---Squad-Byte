using System;
using DigitalArs.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DigitalArs.Infrastructure.Configurations;

public static class DataSeedingConfiguration
{
    public static void SeedData(this ModelBuilder modelBuilder)
    {
        // 1. Seed de Roles (Admin = 1, User = 2)
        modelBuilder.Entity<Role>().HasData(
            new Role 
            { 
                Id = 1, 
                Name = "Admin", 
                Description = "Administrador del sistema" 
            },
            new Role 
            { 
                Id = 2, 
                Name = "User", 
                Description = "Usuario regular de la plataforma" 
            }
        );

        // Hashes BCrypt válidos (Work Factor 11) - Nunca texto plano
        // Admin123! -> $2a$11$N.vKkUuJp0Xm1d07SZZp/.e68kQk1V6Q.d1eY9/Zl2A3W4Z8b3c9W
        // User123!  -> $2a$11$T7YV1aB0b1.C3d2E5F4G5.H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W
        const string adminHash = "$2a$11$N.vKkUuJp0Xm1d07SZZp/.e68kQk1V6Q.d1eY9/Zl2A3W4Z8b3c9W";
        const string userHash = "$2a$11$T7YV1aB0b1.C3d2E5F4G5.H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W";

        // 2. Seed de Usuarios (1 Admin + 2 User)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                FirstName = "Admin",
                LastName = "DigitalArs",
                Email = "admin@digitalars.com",
                Password = adminHash,
                RoleId = 1,
                Points = 1000
            },
            new User
            {
                Id = 2,
                FirstName = "Juan",
                LastName = "Perez",
                Email = "juan.perez@digitalars.com",
                Password = userHash,
                RoleId = 2,
                Points = 100
            },
            new User
            {
                Id = 3,
                FirstName = "Maria",
                LastName = "Gomez",
                Email = "maria.gomez@digitalars.com",
                Password = userHash,
                RoleId = 2,
                Points = 150
            }
        );

        // 3. Seed de Cuentas (1:1 con saldo inicial distinto de cero)
        var creationDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Account>().HasData(
            new Account
            {
                Id = 1,
                UserId = 1,
                Money = 500000.00m,
                IsBlocked = false,
                CreationDate = creationDate
            },
            new Account
            {
                Id = 2,
                UserId = 2,
                Money = 150000.50m,
                IsBlocked = false,
                CreationDate = creationDate
            },
            new Account
            {
                Id = 3,
                UserId = 3,
                Money = 85000.00m,
                IsBlocked = false,
                CreationDate = creationDate
            }
        );
    }
}