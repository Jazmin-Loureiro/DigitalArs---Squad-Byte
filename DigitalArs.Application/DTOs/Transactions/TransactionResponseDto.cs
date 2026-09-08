namespace DigitalArs.Application.DTOs.Transactions;


/// DTO de respuesta para representar un movimiento en el historial de transacciones (HU-17).

public class TransactionResponseDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Concept { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string Type { get; set; } = string.Empty; // "Deposit", "TransferIn", "TransferOut"
    public int AccountId { get; set; }
    public int? ToAccountId { get; set; }
    public string? DestinationAccountEmail { get; set; }
    public string? DestinationUserFullName { get; set; }
}

