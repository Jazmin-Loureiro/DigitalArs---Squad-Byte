using System;
using DigitalArs.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DigitalArs.Infrastructure.Configurations;

public static class DataSeedingConfiguration
{
    public static void SeedData(this ModelBuilder modelBuilder)
    {
        // 1. Roles (Admin = 1, User = 2)
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin", Description = "Administrador del sistema" },
            new Role { Id = 2, Name = "User", Description = "Usuario regular de la plataforma" }
        );

        // 2. Hashes BCrypt reales generados por la aplicación
        const string adminHash = "$2a$11$a7CaaYtCyAL1vCpAt6YUKOPZziCEjXCEtzyowiIovuzWyv0lXWbuK";
        const string userHash  = "$2a$11$X2dq8rOxgNRJ4NHYDX.roOpOvpQxMJbkTEmNLhkooVSAsgJzsij7S";

        // 3. Usuarios asignando las variables correspondientes
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

        // 4. Cuentas con saldo inicial
        var creationDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Account>().HasData(
            new Account { Id = 1, UserId = 1, Money = 500000.00m, IsBlocked = false, CreationDate = creationDate },
            new Account { Id = 2, UserId = 2, Money = 150000.50m, IsBlocked = false, CreationDate = creationDate },
            new Account { Id = 3, UserId = 3, Money = 85000.00m, IsBlocked = false, CreationDate = creationDate }
        );
    }
}