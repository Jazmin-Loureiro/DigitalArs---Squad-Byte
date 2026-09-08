namespace DigitalArs.Application.DTOs.Accounts;

// DTO de respuesta para el endpoint de depósito 
public class DepositResponseDto
{
    public int TransactionId { get; set; }
    public decimal Amount { get; set; }
    public decimal NewBalance { get; set; }
    public DateTime Date { get; set; }
    public string Message { get; set; } = string.Empty;
}
