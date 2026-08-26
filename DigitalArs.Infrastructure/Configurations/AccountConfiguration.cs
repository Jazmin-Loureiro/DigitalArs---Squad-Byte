using DigitalArs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalArs.Infrastructure.Configurations;

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.HasKey(account => account.Id);

        builder
            .Property(account => account.Money)
            .HasPrecision(18, 2);

        builder
            .HasIndex(account => account.UserId)
            .IsUnique();

        builder
            .HasOne(account => account.User)
            .WithOne(user => user.Account)
            .HasForeignKey<Account>(account => account.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}