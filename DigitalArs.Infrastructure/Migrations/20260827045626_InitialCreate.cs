using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalArs.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        // Metodo Up: se ejecuta al aplicar la migracion (dotnet ef database update)
        // Crea las 4 tablas del modelo en orden de dependencia: Roles -> Users -> Accounts -> Transactions
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Tabla Roles: se crea primero porque Users depende de ella via FK
            // PK: Id con IDENTITY(1,1) para autoincremento
            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            // Tabla Users: depende de Roles via FK RoleId
            // Email usa nvarchar(450) porque tiene indice (max para indices en SQL Server)
            // FK: RoleId -> Roles(Id) con ON DELETE RESTRICT (no se puede borrar un rol con usuarios)
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Tabla Accounts: billetera virtual, relacion 1:1 con Users
            // Money usa decimal(18,2) para precision monetaria
            // FK: UserId -> Users(Id) con ON DELETE RESTRICT
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Money = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    IsBlocked = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Accounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Tabla Transactions: registro de movimientos de dinero
            // Amount usa decimal(18,2) para precision monetaria
            // Type almacena el enum TransactionType como int (1=Deposit, 2=TransferIn, 3=TransferOut)
            // FK: AccountId -> cuenta origen (obligatoria), ToAccountId -> cuenta destino (nullable)
            // Ambas FK con ON DELETE RESTRICT para proteger integridad referencial
            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Concept = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    ToAccountId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_Accounts_ToAccountId",
                        column: x => x.ToAccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Indice UNICO en Accounts.UserId: garantiza la relacion 1:1 con Users
            migrationBuilder.CreateIndex(
                name: "IX_Accounts_UserId",
                table: "Accounts",
                column: "UserId",
                unique: true);

            // Indice en Transactions.AccountId: optimiza JOINs por cuenta origen
            migrationBuilder.CreateIndex(
                name: "IX_Transactions_AccountId",
                table: "Transactions",
                column: "AccountId");

            // Indice en Transactions.CreatedDate: optimiza consultas por rango de fechas
            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CreatedDate",
                table: "Transactions",
                column: "CreatedDate");

            // Indice en Transactions.ToAccountId: optimiza busquedas por cuenta destino
            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ToAccountId",
                table: "Transactions",
                column: "ToAccountId");

            // Indice en Users.Email: optimiza busquedas por email (login, validacion)
            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email");

            // Indice en Users.RoleId: optimiza JOINs y filtros por rol
            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
        }

        /// <inheritdoc />
        // Metodo Down: se ejecuta al revertir la migracion (dotnet ef database update 0)
        // Elimina las tablas en orden inverso de dependencia para respetar las FK
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Primero Transactions (depende de Accounts)
            migrationBuilder.DropTable(
                name: "Transactions");

            // Luego Accounts (depende de Users)
            migrationBuilder.DropTable(
                name: "Accounts");

            // Luego Users (depende de Roles)
            migrationBuilder.DropTable(
                name: "Users");

            // Finalmente Roles (tabla independiente)
            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
