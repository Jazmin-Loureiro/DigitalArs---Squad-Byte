-- ============================================================
-- Script DDL generado por EF Core 10.0.11
-- Base de datos: DigitalArsDB
-- Comando: dotnet ef migrations script --output db/schema.sql
-- ============================================================

-- Tabla de control de migraciones de EF Core
-- Registra que migraciones ya fueron aplicadas a esta BD
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;

-- Tabla Roles: almacena los roles del sistema (Admin, Regular)
-- PK: Id (int, autoincremental via IDENTITY)
CREATE TABLE [Roles] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY ([Id])
);

-- Tabla Users: usuarios registrados en la plataforma
-- PK: Id (int, autoincremental via IDENTITY)
-- FK: RoleId -> Roles(Id) con ON DELETE NO ACTION (Restrict)
CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [Email] nvarchar(450) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [Points] int NOT NULL,
    [RoleId] int NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Users_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE NO ACTION
);

-- Tabla Accounts: billetera virtual de cada usuario
-- PK: Id (int, autoincremental via IDENTITY)
-- FK: UserId -> Users(Id) con ON DELETE NO ACTION (Restrict)
-- Money usa decimal(18,2) para precision monetaria
CREATE TABLE [Accounts] (
    [Id] int NOT NULL IDENTITY,
    [CreationDate] datetime2 NOT NULL,
    [Money] decimal(18,2) NOT NULL,
    [IsBlocked] bit NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_Accounts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Accounts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

-- Tabla Transactions: registro de movimientos de dinero
-- PK: Id (int, autoincremental via IDENTITY)
-- FK: AccountId -> Accounts(Id) (cuenta origen, obligatoria)
-- FK: ToAccountId -> Accounts(Id) (cuenta destino, nullable para depositos)
-- Amount usa decimal(18,2) para precision monetaria
-- Type almacena el enum TransactionType como int (1=Deposit, 2=TransferIn, 3=TransferOut)
CREATE TABLE [Transactions] (
    [Id] int NOT NULL IDENTITY,
    [Amount] decimal(18,2) NOT NULL,
    [Concept] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [Type] int NOT NULL,
    [AccountId] int NOT NULL,
    [ToAccountId] int NULL,
    CONSTRAINT [PK_Transactions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Transactions_Accounts_AccountId] FOREIGN KEY ([AccountId]) REFERENCES [Accounts] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Transactions_Accounts_ToAccountId] FOREIGN KEY ([ToAccountId]) REFERENCES [Accounts] ([Id]) ON DELETE NO ACTION
);

-- Indice unico: garantiza relacion 1:1 entre Account y User
CREATE UNIQUE INDEX [IX_Accounts_UserId] ON [Accounts] ([UserId]);

-- Indice para busquedas por cuenta origen en transacciones
CREATE INDEX [IX_Transactions_AccountId] ON [Transactions] ([AccountId]);

-- Indice para consultas por fecha de transaccion (reportes, filtros)
CREATE INDEX [IX_Transactions_CreatedDate] ON [Transactions] ([CreatedDate]);

-- Indice para busquedas por cuenta destino en transferencias
CREATE INDEX [IX_Transactions_ToAccountId] ON [Transactions] ([ToAccountId]);

-- Indice para busquedas por email de usuario (login, validacion unicidad)
CREATE INDEX [IX_Users_Email] ON [Users] ([Email]);

-- Indice para busquedas de usuarios por rol
CREATE INDEX [IX_Users_RoleId] ON [Users] ([RoleId]);

-- Registro de la migracion aplicada en la tabla de historial
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260827045626_InitialCreate', N'10.0.11');

COMMIT;
GO
