using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalArs.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixBCryptSeedHashes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$a7CaaYtCyAL1vCpAt6YUKOPZziCEjXCEtzyowiIovuzWyv0lXWbuK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$X2dq8rOxgNRJ4NHYDX.roOpOvpQxMJbkTEmNLhkooVSAsgJzsij7S");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$X2dq8rOxgNRJ4NHYDX.roOpOvpQxMJbkTEmNLhkooVSAsgJzsij7S");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$N.vKkUuJp0Xm1d07SZZp/.e68kQk1V6Q.d1eY9/Zl2A3W4Z8b3c9W");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$T7YV1aB0b1.C3d2E5F4G5.H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$T7YV1aB0b1.C3d2E5F4G5.H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W");
        }
    }
}
