

namespace DigitalArs.Application.DTOs.Accounts;

// DTO de entrada para el endpoint de depósito (HU-15)
public class DepositRequestDto
{
    public decimal Amount { get; set; }
    public string? Concept { get; set; }
}

