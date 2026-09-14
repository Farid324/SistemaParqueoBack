<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <img src="https://raw.githubusercontent.com/johannes-kr/dino-runner/master/assets/dino.gif" width="120" alt="Chrome Offline Dino" />
</p>

<h1 align="center">SistemaParqueoBack 🚗🅿️</h1>

<p align="center">
  <b>Backend SaaS para la Gestión Inteligente de Parqueos</b><br/>
  Construido con NestJS, TypeScript, Prisma ORM, PostgreSQL, PNPM, Docker y Modular Clean Architecture.
</p>

<p align="center">
  <!-- Badges Tecnológicos -->
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Gmail%20SMTP-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Dino%20Mode-Offline--Proof%20🦖-brightgreen?style=for-the-badge" alt="Dino Offline Proof" />
</p>

---

## 🦖 El Dinosaurio de Chrome & Resiliencia
> *Incluso si te quedas sin internet como el clásico juego del Dinosaurio de Chrome (T-Rex), este backend está totalmente preparado para ejecutarse en entorno offline local gracias a su stack en **Docker**, **pnpm store** local y base de datos **PostgreSQL** contenerizada.* 🦕💨

---

## 📋 Tabla de Contenidos
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Arquitectura del Proyecto (Modular Clean Architecture)](#-arquitectura-del-proyecto-modular-clean-architecture)
- [Requisitos Previos](#-requisitos-previos)
- [Variables de Entorno](#-variables-de-entorno)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución con Docker](#-ejecución-con-docker)
- [Documentación Interactiva Swagger UI](#-documentación-interactiva-swagger-ui)
- [Calidad de Código y Pruebas](#-calidad-de-código-y-pruebas)

---

## 🚀 Funcionalidades Principales

- 🔐 **Autenticación y Autorización (Módulo `auth`)**: Gestión segura de credenciales, tokens JWT y control de acceso basado en roles (`ADMIN`, `OPERATOR`, `CUSTOMER`).
- 🗺️ **Mapa de Parqueos en Tiempo Real (Módulo `parking-map`)**: Gestión interactiva de puestos de estacionamiento, estados ocupado/disponible y tipos de vehículo (`CAR`, `MOTORCYCLE`, `TRUCK`).
- 👤 **Gestión de Usuarios (Módulo `users`)**: Registro, listado y control de usuarios dentro del sistema SaaS.
- ✉️ **Servicio de Email con Google (Módulo `shared/email`)**: Envío de correos transaccionales con **Gmail SMTP**, **Nodemailer** y plantillas **Handlebars** (`.hbs`).
- 🛠️ **Integración de Prisma ORM**: Modelado estricto con PostgreSQL, cliente autogenerado y migraciones.
- 🐳 **Entorno Dockerizado**: `Dockerfile` multi-stage optimizado con `pnpm` y `docker-compose.yml` para levantar la API y PostgreSQL con 1 solo comando.
- 🔄 **Integración Continua (CI)**: Pipeline automático con **GitHub Actions** para formateo, linting, compilación y ejecucion de pruebas.

---

## 🏗️ Arquitectura del Proyecto (Modular Clean Architecture)

El proyecto sigue la arquitectura **Modular Clean Architecture (Feature-First)**. El código se divide en **Módulos de Dominio** dentro de `src/modules/` y recursos globales transversales dentro de `src/shared/`.

```text
SistemaParqueoBack/
├── .github/workflows/ci.yml       # Workflow de Integración Continua (CI) en GitHub Actions
├── .husky/                        # Git Hooks para linters pre-commit
├── prisma/                        # Esquema de base de datos PostgreSQL y migraciones
│   └── schema.prisma
│
├── src/                           # 🧠 CÓDIGO FUENTE
│   ├── modules/                   # 📦 MÓDULOS DE NEGOCIO
│   │   ├── auth/                  # Módulo de Autenticación
│   │   │   ├── domain/            # Entidades y contratos de repositorio
│   │   │   ├── application/       # Casos de uso (login, register)
│   │   │   ├── infrastructure/    # Guards, JWT, bcrypt y persistencia
│   │   │   ├── presentation/      # AuthController y AuthDto
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── mapa-parqueo/           # Módulo de Mapa de Parqueos
│   │   │   ├── domain/            # Entidades de Zonas y Slots
│   │   │   ├── application/       # Casos de uso del mapa
│   │   │   ├── infrastructure/    # Gateways de WebSockets y Repositorios
│   │   │   ├── presentation/      # MapaParqueoController y DTOs
│   │   │   └── mapa-parqueo.module.ts
│   │   │
│   │   ├── usuarios/               # Módulo de Usuarios
│   │   │   ├── domain/            # UsuarioEntity, IUsuarioRepository
│   │   │   ├── application/       # CrearUsuarioUseCase, ObtenerUsuariosUseCase
│   │   │   ├── infrastructure/    # PrismaUsuarioRepository, UsuarioMapper
│   │   │   ├── presentation/      # UsuarioController, CrearUsuarioDto
│   │   │   └── usuarios.module.ts
│   │   │
│   │   └── salud/                 # Módulo de comprobación de salud del sistema
│   │       ├── application/       # ObtenerSaludUseCase
│   │       ├── presentation/      # SaludController
│   │       └── salud.module.ts
│   │
│   ├── shared/                    # 🤝 RECURSOS COMPARTIDOS (TRANSVERSALES)
│   │   ├── domain/                # Interfaces compartidas (IEmailService)
│   │   ├── infrastructure/        # PrismaModule, EmailModule (Nodemailer + Gmail + Handlebars)
│   │   └── shared.module.ts
│   │
│   ├── app.module.ts              # Orquestación de módulos en NestJS
│   └── main.ts                    # Punto de entrada (Swagger UI, ValidationPipe, CORS)
│
├── Dockerfile                     # Multi-stage build optimizado en node:22-alpine con pnpm
├── docker-compose.yml             # Orquestación de la API NestJS + PostgreSQL
├── eslint.config.mjs              # Configuración de ESLint 9 (Flat Config)
├── .prettierrc                    # Reglas de formateo Prettier
└── package.json                   # Gestor de paquetes configurado con pnpm
```

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu entorno local:

- **Node.js**: `v22.x` o superior
- **pnpm**: `v10.x` o superior (`npm install -g pnpm`)
- **Docker** y **Docker Compose**
- **Git**

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la plantilla `.env.example`:

```env
# App Environment
PORT=3000
NODE_ENV=development

# Prisma Database URL (PostgreSQL local o en Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistemaparqueodb?schema=public"

# Google Mail Configuration (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu-cuenta@gmail.com
MAIL_PASSWORD=tu-contraseña-de-aplicacion-google
MAIL_FROM="Sistema Parqueo SaaS" <tu-cuenta@gmail.com>
```

> 💡 **Nota sobre Gmail**: Para obtener `MAIL_PASSWORD`, activa la *Verificación en 2 pasos* en tu cuenta de Google y genera una *Contraseña de aplicación* en la sección de seguridad de Google.

---

## 📦 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/SistemaParqueoBack.git
   cd SistemaParqueoBack
   ```

2. **Instalar dependencias con `pnpm`:**
   ```bash
   pnpm install
   ```

3. **Generar el cliente de Prisma:**
   ```bash
   pnpm run prisma:generate
   ```

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
   pnpm run start:dev
   ```

---

## 🐳 Ejecución con Docker

Puedes levantar el entorno completo (API NestJS + Base de datos PostgreSQL) mediante Docker Compose:

```bash
# Iniciar servicios en segundo plano
pnpm run docker:up

# Ver logs de la aplicación y la base de datos
docker-compose logs -f

# Detener los servicios
pnpm run docker:down
```

---

## 📚 Documentación Interactiva Swagger UI

Una vez iniciado el servidor, accede a la documentación interactiva de la API OpenAPI / Swagger en tu navegador:

🔗 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 🧪 Calidad de Código y Pruebas

El proyecto cuenta con linter, formateador automático y pruebas unitarias integradas:

```bash
# Ejecutar linter (ESLint 9)
pnpm run lint

# Verificar formato de código (Prettier)
pnpm run format:check

# Formatear código automáticamente
pnpm run format

# Ejecutar pruebas unitarias (Jest)
pnpm test

# Ejecutar pruebas e2e
pnpm run test:e2e
```

---

<p align="center">
  Desarrollado con ❤️ y 🦖 por el equipo de <b>SistemaParqueo SaaS</b>
</p>
