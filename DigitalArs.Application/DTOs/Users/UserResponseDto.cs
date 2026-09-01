namespace DigitalArs.Application.DTOs.Users;

public class UserResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Points { get; set; }
    public int RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
}