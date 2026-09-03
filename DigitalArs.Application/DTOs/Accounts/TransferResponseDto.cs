namespace DigitalArs.Application.DTOs.Accounts;

// DTO de respuesta para el endpoint de transferencia (HU-16)
public class TransferResponseDto
{
    public int OutTransactionId { get; set; }       // ID de la transacción de débito (TransferOut)
    public int InTransactionId { get; set; }        // ID de la transacción de crédito (TransferIn)
    public decimal Amount { get; set; }
    public decimal NewBalance { get; set; }         // Saldo del emisor luego de la transferencia
    public int FromAccountId { get; set; }
    public int ToAccountId { get; set; }
    public DateTime Date { get; set; }
    public string Message { get; set; } = string.Empty;
}
