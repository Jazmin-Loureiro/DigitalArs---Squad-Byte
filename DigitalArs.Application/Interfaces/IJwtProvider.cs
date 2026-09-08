using DigitalArs.Domain.Entities;

namespace DigitalArs.Application.Interfaces;

public interface IJwtProvider
{
    (string Token, DateTime Expiration) GenerateToken(User user);
}