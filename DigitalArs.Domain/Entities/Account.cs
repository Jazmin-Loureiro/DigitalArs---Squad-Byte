namespace DigitalArs.Domain.Entities
{
    // Cuenta virtual o billetera del usuario
    public class Account
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
        public decimal Money { get; set; } = 0m; // Decimal para precision monetaria
        public bool IsBlocked { get; set; } = false;

        // Clave foranea y relacion con User
        public int UserId { get; set; }
        public User? User { get; set; }

        // Relacion 1 a N: Transacciones de la cuenta
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}