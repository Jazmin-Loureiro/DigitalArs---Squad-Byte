namespace DigitalArs.Domain.Entities{
    // Tipos de transacciones disponibles en la billetera
    public enum TransactionType
    {
        Deposit = 1,     // Deposito de dinero
        TransferIn = 2,  // Transferencia recibida
        TransferOut = 3  // Transferencia enviada
    }
}