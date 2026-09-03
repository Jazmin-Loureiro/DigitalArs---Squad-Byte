using System.Threading.Tasks;
using DigitalArs.Application.Common;
using DigitalArs.Application.DTOs.Users;

namespace DigitalArs.Application.Interfaces;

public interface IUserService
{
    Task<PagedResultDto<UserResponseDto>> GetPagedUsersAsync(string? search = null, int page = 1, int pageSize = 10);
    Task<UserResponseDto?> GetByIdAsync(int id);
    Task<UserResponseDto> CreateAsync(UserCreateDto dto);
    Task<UserResponseDto?> UpdateAsync(int id, UserUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}