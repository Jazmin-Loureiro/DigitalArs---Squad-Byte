using DigitalArs.Application.DTOs.Accounts;
using FluentValidation;

namespace DigitalArs.Application.Validators.Accounts;

// Validador declarativo para el DTO de transferencia 
public class TransferRequestValidator : AbstractValidator<TransferRequestDto>
{
    public TransferRequestValidator()
    {
        RuleFor(x => x.ToAccountId)
            .GreaterThan(0).WithMessage("El ID de la cuenta destino debe ser un valor positivo.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a cero.")
            .PrecisionScale(18, 2, ignoreTrailingZeros: true)
            .WithMessage("El monto no puede tener más de 2 decimales.");

        RuleFor(x => x.Concept)
            .MaximumLength(200).WithMessage("El concepto no puede superar los 200 caracteres.")
            .When(x => !string.IsNullOrWhiteSpace(x.Concept));
    }
}
