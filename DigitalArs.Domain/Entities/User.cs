namespace DigitalArs.Domain.Entities{
    // Usuario registrado en la plataforma
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int Points { get; set; } = 0;

        // Clave foranea y relacion con Role
        public int RoleId { get; set; }
        public Role? Role { get; set; }

        // Relacion 1 a 1: Un usuario tiene una cuenta
        public Account? Account { get; set; }
    }
}