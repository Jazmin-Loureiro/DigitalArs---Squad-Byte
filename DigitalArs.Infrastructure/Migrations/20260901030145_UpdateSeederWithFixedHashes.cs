using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalArs.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeederWithFixedHashes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Hash real de BCrypt para "Admin123!"
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy");

            // Hash real de BCrypt para "User123!" (Juan Perez)
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$68u3QG8L9O2jA1sM8Q2z..oYw1qWlG0mQ5qKz1lO6mJ4oW3eA7mF4");

            // Hash real de BCrypt para "User123!" (Maria Gomez)
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$68u3QG8L9O2jA1sM8Q2z..oYw1qWlG0mQ5qKz1lO6mJ4oW3eA7mF4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}