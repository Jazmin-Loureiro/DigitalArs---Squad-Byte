using DigitalArs.Application.DTOs.Accounts;
using FluentValidation;

namespace DigitalArs.Application.Validators.Accounts;

// Validador declarativo para el DTO de depósito 
public class DepositRequestValidator : AbstractValidator<DepositRequestDto>
{
    public DepositRequestValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a cero.")
            .PrecisionScale(18, 2, ignoreTrailingZeros: true)
            .WithMessage("El monto no puede tener más de 2 decimales.");

        RuleFor(x => x.Concept)
            .MaximumLength(200).WithMessage("El concepto no puede superar los 200 caracteres.")
            .When(x => !string.IsNullOrWhiteSpace(x.Concept));
    }
}
