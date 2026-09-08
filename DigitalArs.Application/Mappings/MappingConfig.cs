using DigitalArs.Application.DTOs.Users;
using DigitalArs.Domain.Entities;
using Mapster;

namespace DigitalArs.Application.Mappings;

public static class MappingConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<User, UserResponseDto>.NewConfig()
            .Map(dest => dest.RoleName, src => src.Role != null ? src.Role.Name : string.Empty);
    }
}