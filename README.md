# 💳 DigitalArs - Billetera Virtual

> Plataforma fintech integral de billetera virtual desarrollada bajo metodología ágil Scrum para la gestión segura de cuentas monetarias, transferencias en tiempo real y administración de usuarios. Construida con arquitectura desacoplada: API REST en **C# con .NET 10** y aplicación web cliente en **React + Vite** con sistema de diseño basado en **Material UI (MUI v5)**.

---

## 📌 Tabla de Contenidos

1. [Descripción General y Caso de Negocio](#-descripción-general-y-caso-de-negocio)
2. [Arquitectura del Sistema y Patrones de Diseño](#-arquitectura-del-sistema-y-patrones-de-diseño)
3. [Stack Tecnológico Detallado](#-stack-tecnológico-detallado)
4. [Modelo de Datos e Integridad Referencial](#-modelo-de-datos-e-integridad-referencial)
5. [Reporte Técnico de Optimización de Base de Datos](#-reporte-técnico-de-optimización-de-base-de-datos)
6. [Reporte de Mejoras de Interfaz (UI/UX)](#-reporte-de-mejoras-de-interfaz-uiux)
7. [Requisitos Previos del Entorno](#-requisitos-previos-del-entorno)
8. [Guía de Instalación y Puesta en Marcha](#-guía-de-instalación-y-puesta-en-marcha)
9. [Usuarios de Prueba y Data Seeding](#-usuarios-de-prueba-y-data-seeding)
10. [Catálogo de Endpoints (API REST)](#-catálogo-de-endpoints-api-rest)
11. [Suite de Tests Automatizados](#-suite-de-tests-automatizados)
12. [Políticas de Seguridad y Manejo de Secretos](#-políticas-de-seguridad-y-manejo-de-secretos)
13. [Estructura del Repositorio](#-estructura-del-repositorio)
14. [Metodología de Trabajo y Equipo](#-metodología-de-trabajo-y-equipo)

---

## 💼 Descripción General y Caso de Negocio

DigitalArs responde a la necesidad de digitalizar y agilizar el intercambio monetario mediante un entorno confiable, reactivo y respaldado por transacciones consistentes (ACID). El sistema opera bajo un esquema de doble rol funcional:

### 👤 Módulo de Usuario Regular (Billetera)

- **Control de Balances:** Consulta en tiempo real de fondos en cuenta ($ ARS).
- **Operaciones Monetarias:** Depósitos directos y transferencias inmediatas entre cuentas con validación de saldo disponible y prevención estricta de autotransferencias.
- **Historial de Movimientos:** Grilla transaccional con paginación desde el servidor, orden cronológico descendente y filtros combinables por tipo de operación (Depósito, Transferencia Enviada, Transferencia Recibida) y fechas.
- **Perfil y Seguridad:** Modificación de datos personales y actualización de credenciales exigiendo verificación de contraseña actual.

### 🛡️ Módulo de Administración

- **Gobernanza Centralizada:** Panel con búsqueda reactiva de usuarios por nombre o correo electrónico, selector de estado y paginación.
- **Operaciones CRUD:** Registro manual de usuarios con asignación directa de rol (Admin o User), edición de datos de perfil y baja lógica preventiva (`soft delete` mediante `isActive = false`).
- **Reglas de Integridad Operativa:** El sistema inhabilita la auto-eliminación del administrador en sesión y restringe operaciones sobre cuentas dadas de baja sin previa reactivación.

---

## 🏛️ Arquitectura del Sistema y Patrones de Diseño

El backend se organiza en una arquitectura multicapa desacoplada orientada al dominio:

- **Separación en Capas:**
  - `DigitalArs` (API): Controladores REST, configuración del middleware de excepciones, Swagger y pipeline HTTP.
  - `DigitalArs.Application`: Servicios de aplicación, reglas de validación y DTOs de request/response.
  - `DigitalArs.Domain`: Entidades del núcleo del negocio (`User`, `Role`, `Account`, `Transaction`) y enumeradores de dominio.
  - `DigitalArs.Infrastructure`: Implementación de Entity Framework Core, DbContext, configuraciones Fluent API y repositorios.
  - `DigitalArs.Application.Tests`: Suite de pruebas unitarias automatizadas con xUnit y Moq.
- **Patrón Unit of Work & Repositorios:** Coordina el acceso a datos abstrayendo el `DbContext`. Asegura que las transferencias bancarias (débito de la cuenta emisora y crédito en la cuenta receptora) se ejecuten en una transacción única bajo un bloque atómico con rollback automático ante cualquier fallo.
- **Role-Based Access Control (RBAC):** Autenticación y autorización basada en claims incrustados en tokens JWT, verificados tanto en los controladores de la API mediante `[Authorize(Roles = "...")]` como en el ruteo privado de React (`ProtectedRoute`).
- **Mapeo y Aislamiento DTO:** Las entidades del dominio nunca se exponen directamente al cliente web; se mapean a DTOs específicos garantizando que contraseñas hasheadas y datos internos nunca salgan en los responses.

---

## 🛠️ Stack Tecnológico Detallado

### Backend

- **Lenguaje y Framework:** C# sobre .NET 10 (ASP.NET Core Web API).
- **ORM & Persistencia:** Entity Framework Core (Code First) con SQL Server.
- **Seguridad:** JWT (JSON Web Tokens) con algoritmo HMAC SHA256 y hashing de claves mediante BCrypt con salting individual.
- **Manejo Global de Errores:** Middleware customizado que normaliza los códigos HTTP (`400`, `401`, `403`, `404`, `500`), trace identifiers y previene la exposición de stack traces en producción.
- **Testing:** xUnit, FluentAssertions y Moq para aislamiento de dependencias.
- **Documentación:** Swagger UI (`/swagger`) y colección interactiva de Postman.

### Frontend

- **Entorno y Framework:** React 18+ sobre Vite.
- **Sistema de Componentes:** Material UI (MUI v5) desacoplado mediante tokens de diseño (`theme.js`, `tokens.js`) con soporte nativo para **Light / Dark Mode**.
- **Manejo de Estado y Sesión:** Context API (`AuthContext`) con persistencia local de token y roles.
- **Comunicación HTTP:** Axios con interceptores automáticos para inyección del header `Authorization: Bearer <token>` y captura reactiva de errores 401.
- **Ruteo:** React Router DOM v6 con layouts responsivos y navegación flotante móvil (`Floating Bottom Bar`).

---

## 🗄️ Modelo de Datos e Integridad Referencial

El esquema relacional fue modelado mediante Entity Framework Core Code First aplicando configuraciones desacopladas con `IEntityTypeConfiguration<T>`:

![Diagrama Entidad Relación](../DigitalArs---Squad-Byte/docs/database/digitalars-er-diagram.png)

### Reglas Estructurales:

- **`Role` 1:N `User`:** Un rol predeterminado agrupa a múltiples usuarios del sistema.
- **`User` 1:1 `Account`:** Cada usuario dispone de exactamente una cuenta monetaria ligada mediante un índice único (`IX_Accounts_UserId`).
- **`Account` 1:N `Transaction`:** Una cuenta registra transferencias y depósitos vinculando las claves foráneas `AccountId` (origen) y `ToAccountId` (destino opcional).
- **Prevención de Ciclos:** Las relaciones cuentan con restricción de borrado `DeleteBehavior.Restrict` para proteger la integridad histórica de las transacciones bancarias.

---

## ⚡ Reporte Técnico de Optimización

El modelo de datos y las consultas se optimizaron para reducir latencia, consumo de memoria y garantizar consistencia en operaciones financieras:

- **Búsqueda Logarítmica de Usuarios:** Índice único `IX_Users_Email` para resolución inmediata en autenticación ($O(\log n)$) y prevención de correos duplicados.
- **Cardinalidad 1:1 Forzada:** Índice único `IX_Accounts_UserId` que garantiza una única cuenta por usuario a nivel motor y acelera la carga de balances.
- **Historial Financiero Paginado:** Índices en `IX_Transactions_AccountId` y `IX_Transactions_ToAccountId` junto con ordenamiento indexado en `CreatedDate`, permitiendo paginación eficiente desde la base de datos mediante `OFFSET / FETCH NEXT` sin sobrecargar la memoria.
- **Lecturas de Alto Rendimiento:** Uso de `AsNoTracking()` en endpoints de solo lectura (balances, transacciones y perfil) para omitir el rastreador de cambios de EF Core.
- **Transacciones Atómicas:** Las transferencias entre cuentas operan bajo el patrón **Unit of Work** con bloques transaccionales explícitos para garantizar atomicidad (ACID) y rollback automático ante cualquier excepción.

---

## 🎨 Reporte de Mejoras de Interfaz (UI/UX)

- **Diseño Adaptativo Integral (Responsive Design):** Interfaz fluida adaptada a resoluciones móviles, tablets y monitores de escritorio.
- **Soporte de Temas (Light / Dark Mode):** Estilos, tipografías y contrastes centralizados mediante tokens de diseño para alternar entre modo claro y oscuro.
- **Navegación Móvil Ergonómica:** Barra de navegación inferior flotante tipo cápsula con efecto translúcido, pensada para interacción táctil con una sola mano.
- **Optimización de Pantallas Densas (Movimientos y Administración):** Rediseño de tablas transaccionales y paneles de gestión eliminando sobrecargas visuales, jerarquizando importes y fechas, y adaptando filtros y paginación para operar fluidamente en pantallas reducidas sin desbordes.
- **Feedback y Diálogos Centralizados:** Componentes unificados para confirmación de transacciones, modales de acción y alertas de estado (`FeedbackSnackbar`).

---

## 📋 Requisitos Previos del Entorno

Antes de comenzar la instalación, asegurate de contar con las siguientes herramientas instaladas en tu sistema:

- **.NET 10 SDK:** Verificar en la terminal ejecutando `dotnet --version`.
- **Node.js (v18.x o superior):** Incluye gestor de paquetes `npm`. Verificar con `node -v` y `npm -v`.
- **SQL Server:** Instancia local activa (SQL Server Express, LocalDB o contenedor Docker).
- **Git:** Control de versiones para la clonación del repositorio.

---

## 🚀 Guía de Instalación y Puesta en Marcha

### Paso 1: Clonar el Repositorio

Clonar el repositorio y situarse en la rama develop:

```bash
git clone https://github.com/Jazmin-Loureiro/DigitalArs---Squad-Byte.git
cd DigitalArs---Squad-Byte
git checkout develop
```

---

### Paso 2: Configuración y Ejecución del Backend (.NET 10)

En la raíz de la solución, verificar la configuración en `appsettings.Development.json` (o `appsettings.json`):

```json
{
  "ConnectionStrings": {
    "DigitalArsDB": "Server=localhost;Database=DigitalArsDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "REEMPLAZAR_POR_CLAVE_SECRETA_DE_AL_MENOS_32_CARACTERES_2026!",
    "Issuer": "DigitalArsAPI",
    "Audience": "DigitalArsClient",
    "ExpirationInMinutes": 60
  }
}
```

Restaurar dependencias NuGet de la solución:

```bash
dotnet restore
```

Aplicar las migraciones de Entity Framework Core para crear la base de datos y cargar los datos iniciales (Data Seeding):

```bash
dotnet ef database update --project DigitalArs.Infrastructure --startup-project DigitalArs
```

Iniciar la API:

```bash
dotnet run --project DigitalArs
```

API en ejecución: http://localhost:5016

Swagger UI interactivo: http://localhost:5016/swagger

---

### Paso 3: Configuración y Ejecución del Frontend (React + Vite)

Abrir una terminal y situarse en la carpeta del cliente web:

```bash
cd frontend/digitalars-frontend
```

Instalar los paquetes y dependencias del proyecto:

```bash
npm install
```

Crear el archivo .env en la raíz de digitalars-frontend apuntando al backend local:

```bash
VITE_API_URL=http://localhost:5016/api
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Aplicación web disponible en: http://localhost:5173

## 👥 Usuarios de Prueba y Data Seeding

La base de datos cuenta con registros precargados mediante el seeder oficial para realizar pruebas funcionales de inmediato:

| Rol       | Nombre           | Correo Electrónico         | Contraseña | Saldo Inicial ($ ARS) |
| :-------- | :--------------- | :------------------------- | :--------- | :-------------------- |
| **Admin** | Admin DigitalArs | admin@digitalars.com       | Admin123!  | $500.000,00           |
| **User**  | Juan Pérez       | juan.perez@digitalars.com  | User123!   | $150.000,50           |
| **User**  | María Gómez      | maria.gomez@digitalars.com | User123!   | $85.000,00            |

> **Nota de Seguridad:** Todas las contraseñas almacenadas se encuentran hasheadas criptográficamente mediante algoritmo BCrypt y nunca en texto plano.

---

## 📡 Catálogo de Endpoints (API REST)

Colección de endpoints testeada y documentada en Swagger (http://localhost:5016):

| Módulo        | Método | Endpoint                   | Acceso      | Descripción                                          | Códigos HTTP            |
| :------------ | :----- | :------------------------- | :---------- | :--------------------------------------------------- | :---------------------- |
| **Auth**      | POST   | /api/auth/login            | Público     | Autentica credenciales y emite token Bearer JWT      | 200, 401                |
| **Usuarios**  | GET    | /api/users/me              | Autenticado | Obtiene los datos del perfil del usuario en sesión   | 200, 401                |
| **Usuarios**  | PUT    | /api/users/me              | Autenticado | Actualiza datos propios o modifica contraseña        | 200, 400, 401           |
| **Usuarios**  | GET    | /api/users                 | Admin       | Listado paginado de usuarios con soporte de búsqueda | 200, 401, 403           |
| **Usuarios**  | GET    | /api/users/{id}            | Admin       | Consulta el detalle de un usuario específico         | 200, 401, 403, 404      |
| **Usuarios**  | POST   | /api/users                 | Admin       | Registro manual de usuario con asignación de rol     | 201, 400, 401, 403, 409 |
| **Usuarios**  | PUT    | /api/users/{id}            | Admin       | Modificación de nombre y apellido de usuarios        | 200, 400, 401, 403, 404 |
| **Usuarios**  | DELETE | /api/users/{id}            | Admin       | Baja lógica preventiva (soft delete)                 | 200, 400, 401, 403, 404 |
| **Cuentas**   | GET    | /api/accounts/me           | Autenticado | Obtiene balance actual                               | 200, 401                |
| **Cuentas**   | GET    | /api/accounts/{id}         | Admin       | Consulta administrativa de una cuenta monetaria      | 200, 401, 403, 404      |
| **Cuentas**   | POST   | /api/accounts/deposit      | Autenticado | Depósito de saldo en la cuenta propia                | 200, 400, 401           |
| **Cuentas**   | POST   | /api/transactions/transfer | Autenticado | Transferencia atómica de fondos entre cuentas        | 200, 400, 401, 404      |
| **Historial** | GET    | /api/transactions/me       | Autenticado | Historial paginado con filtros por tipo y fecha      | 200, 401                |

---

## 🧪 Suite de Tests Automatizados

El backend incorpora un proyecto de pruebas unitarias (`DigitalArs.Application.Tests`) desarrollado con **xUnit** y **Moq** para validar la lógica crítica de negocio:

- **Autenticación:** Cobertura de inicio de sesión exitoso, detección de credenciales inválidas y bloqueo de acceso a usuarios con estado inactivo.
- **Transacciones Monetarias:** Validación de límites en depósitos, transferencias exitosas, rechazo por saldo insuficiente y bloqueo de autotransferencias.
- **Integridad Transaccional:** Comprobación del rollback automático ante excepciones en operaciones atómicas.

Para ejecutar toda la suite de pruebas desde la terminal:

```bash
dotnet test
```

---

## 🔐 Políticas de Seguridad y Manejo de Secretos

- **Control de Versiones Limpio:** Archivo `.gitignore` configurado estrictamente para evitar el commiteo de archivos con variables sensibles (`.env`, `appsettings.Production.json`), certificados o artefactos de compilación (`bin/`, `obj/`, `node_modules/`).
- **Aislamiento de Secretos:** La firma secreta de JWT configurada en el entorno de desarrollo es exclusivamente local. En despliegues productivos se inyecta mediante variables de entorno del servidor.
- **Criptografía de Contraseñas:** Algoritmo BCrypt con salt criptográfico individual por usuario para neutralizar ataques basados en tablas arcoíris.
- **Autorización por Capas:** Doble verificación de privilegios: control de acceso en las rutas de React y validación estricta en cada endpoint mediante atributos `[Authorize]`.

---

## 📂 Estructura del Repositorio

```text
DigitalArs---Squad-Byte/
├── db/                                   # Scripts y recursos de base de datos
├── DigitalArs/                           # API Controllers, Middleware y Swagger
├── DigitalArs.Application/               # Servicios de aplicación, DTOs y lógica
├── DigitalArs.Application.Tests/         # Tests Unitarios (xUnit + Moq)
├── DigitalArs.Domain/                    # Entidades Core (User, Role, Account, Transaction)
├── DigitalArs.Infrastructure/            # EF Core, DbContext, Mapeos y Seeding
├── docs/                                 # Documentación y Diagrama Entidad-Relación
├── frontend/                             # Aplicación Cliente (React 18 + Vite + MUI)
├── .gitignore                            # Exclusión de secretos y dependencias
└── README.md                             # Documentación técnica principal
```

---

## 👥 Metodología de Trabajo y Equipo

El proyecto fue planificado y ejecutado bajo la metodología ágil **Scrum** por el equipo **Squad Byte**, participando en ceremonias de planificación, dailys de sincronización y revisiones técnicas:

- **Marcelo Guanes** - Desarrollo Full Stack
- **Tania Bertolozzi** - Desarrollo Full Stack
- **Jazmín Loureiro** - Desarrollo Full Stack
