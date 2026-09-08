using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalArs.Application.Common;
using DigitalArs.Application.DTOs.Users;
using DigitalArs.Application.Interfaces;
using DigitalArs.Domain.Entities;

namespace DigitalArs.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<PagedResultDto<UserResponseDto>> GetPagedUsersAsync(string? search = null, int page = 1, int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var allUsers = await _unitOfWork.Users.GetAllAsync();
        var allRoles = await _unitOfWork.Roles.GetAllAsync();
        var rolesDict = allRoles.ToDictionary(r => r.Id, r => r.Name);

        var query = allUsers.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term) ||
                u.Email.ToLower().Contains(term));
        }

        var totalCount = query.Count();

        var pagedItems = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Points = u.Points,
                IsActive = u.IsActive,
                RoleId = u.RoleId,
                RoleName = rolesDict.TryGetValue(u.RoleId, out var rName) ? rName : string.Empty
            })
            .ToList();

        return new PagedResultDto<UserResponseDto>(pagedItems, totalCount, page, pageSize);
    }

    public async Task<UserResponseDto?> GetByIdAsync(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null) return null;

        var role = await _unitOfWork.Roles.GetByIdAsync(user.RoleId);

        return new UserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Points = user.Points,
            IsActive = user.IsActive,
            RoleId = user.RoleId,
            RoleName = role?.Name ?? string.Empty
        };
    }

    public async Task<UserResponseDto> CreateAsync(UserCreateDto dto)
    {
        var existingUsers = await _unitOfWork.Users.FindAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (existingUsers.Any())
        {
            throw new InvalidOperationException($"El correo '{dto.Email}' ya se encuentra registrado.");
        }

        var hashedPassword = _passwordHasher.HashPassword(dto.Password);

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Password = hashedPassword,
            RoleId = dto.RoleId,
            Points = 0,
            IsActive = true
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var account = new Account
        {
            UserId = user.Id,
            Money = 0m,
            IsBlocked = false,
            CreationDate = DateTime.UtcNow
        };
        await _unitOfWork.Accounts.AddAsync(account);
        await _unitOfWork.SaveChangesAsync();

        var role = await _unitOfWork.Roles.GetByIdAsync(user.RoleId);

        return new UserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Points = user.Points,
            IsActive = user.IsActive,
            RoleId = user.RoleId,
            RoleName = role?.Name ?? string.Empty
        };
    }

    public async Task<UserResponseDto?> UpdateAsync(int id, UserUpdateDto dto)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null || !user.IsActive) return null;

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;

        // Validación estricta para HU-13: si viene NewPassword, CurrentPassword es obligatorio
        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
            {
                throw new ArgumentException("Debe ingresar su contraseña actual para poder cambiarla.");
            }

            var isCurrentValid = _passwordHasher.VerifyPassword(dto.CurrentPassword, user.Password);
            if (!isCurrentValid)
            {
                throw new ArgumentException("La contraseña actual proporcionada es incorrecta.");
            }

            user.Password = _passwordHasher.HashPassword(dto.NewPassword);
        }

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        var role = await _unitOfWork.Roles.GetByIdAsync(user.RoleId);

        return new UserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Points = user.Points,
            IsActive = user.IsActive,
            RoleId = user.RoleId,
            RoleName = role?.Name ?? string.Empty
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null) return false;

        user.IsActive = false;
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}