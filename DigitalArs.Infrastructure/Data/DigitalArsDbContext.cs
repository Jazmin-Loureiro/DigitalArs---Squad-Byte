using DigitalArs.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DigitalArs.Infrastructure.Data;

public class DigitalArsDbContext : DbContext
{
    public DigitalArsDbContext(DbContextOptions<DigitalArsDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(DigitalArsDbContext).Assembly
        );
    }
}