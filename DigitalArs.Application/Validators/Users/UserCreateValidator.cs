using DigitalArs.Application.DTOs.Users;
using FluentValidation;

namespace DigitalArs.Application.Validators.Users;

public class UserCreateValidator : AbstractValidator<UserCreateDto>
{
    public UserCreateValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(50).WithMessage("El nombre no puede superar los 50 caracteres.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("El apellido es obligatorio.")
            .MaximumLength(50).WithMessage("El apellido no puede superar los 50 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El correo electrónico es obligatorio.")
            .EmailAddress().WithMessage("El formato del correo electrónico no es válido.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria.")
            .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres.");

        RuleFor(x => x.RoleId)
            .GreaterThan(0).WithMessage("Debe asignar un rol válido.");
    }
}