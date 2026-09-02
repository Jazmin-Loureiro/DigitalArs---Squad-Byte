namespace DigitalArs.Application.DTOs.Accounts;


// DTO para la respuesta con la información pública de la cuenta del usuario
public class AccountResponseDto
{
    public int Id { get; set; }
    public decimal Money { get; set; }
    public DateTime CreationDate { get; set; }
    public bool IsBlocked { get; set; }
}
