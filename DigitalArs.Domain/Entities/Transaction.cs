namespace DigitalArs.Domain.Entities{
    // Registro de movimientos de dinero
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; } = 0m;
        public string Concept { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;        
        public TransactionType Type { get; set; }

        // Cuenta origen
        public int AccountId { get; set; }
        public Account? Account { get; set; }

        // Cuenta destino (opcional para transferencias)
        public int? ToAccountId { get; set; }
        public Account? ToAccount { get; set; }
    }
}