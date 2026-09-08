using DigitalArs.Application.DTOs.Users;
using FluentValidation;

namespace DigitalArs.Application.Validators.Users;

public class UserUpdateValidator : AbstractValidator<UserUpdateDto>
{
    public UserUpdateValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(50).WithMessage("El nombre no puede superar los 50 caracteres.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("El apellido es obligatorio.")
            .MaximumLength(50).WithMessage("El apellido no puede superar los 50 caracteres.");

        When(x => !string.IsNullOrWhiteSpace(x.NewPassword), () =>
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Debe ingresar la contraseña actual para establecer una nueva.");

            RuleFor(x => x.NewPassword)
                .MinimumLength(6).WithMessage("La nueva contraseña debe tener al menos 6 caracteres.");
        });
    }
}