namespace DigitalArs.Application.DTOs.Accounts;

// DTO de entrada para el endpoint de transferencia 
public class TransferRequestDto
{
    public int ToAccountId { get; set; }
    public decimal Amount { get; set; }
    public string? Concept { get; set; }
}
