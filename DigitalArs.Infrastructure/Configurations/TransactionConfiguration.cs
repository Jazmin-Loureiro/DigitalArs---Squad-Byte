using DigitalArs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalArs.Infrastructure.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.HasKey(transaction => transaction.Id);

        builder
            .Property(transaction => transaction.Amount)
            .HasPrecision(18, 2);

        builder.HasIndex(transaction => transaction.CreatedDate);

        builder
            .HasOne(transaction => transaction.Account)
            .WithMany(account => account.Transactions)
            .HasForeignKey(transaction => transaction.AccountId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(transaction => transaction.ToAccount)
            .WithMany()
            .HasForeignKey(transaction => transaction.ToAccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}