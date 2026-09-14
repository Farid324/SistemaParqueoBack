-- CreateEnum
CREATE TYPE "EstadoOrganizacion" AS ENUM ('ACTIVA', 'SUSPENDIDA');

-- CreateEnum
CREATE TYPE "EstadoSuscripcion" AS ENUM ('PRUEBA', 'ACTIVA', 'VENCIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_ADMIN', 'PROPIETARIO', 'OPERADOR', 'CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoParqueadero" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoVehiculo" AS ENUM ('AUTO', 'MOTOCICLETA', 'CAMION');

-- CreateEnum
CREATE TYPE "EstadoEspacio" AS ENUM ('DISPONIBLE', 'OCUPADO', 'RESERVADO', 'MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'ACTIVA', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO');

-- CreateTable
CREATE TABLE "organizaciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nit" TEXT,
    "estado" "EstadoOrganizacion" NOT NULL DEFAULT 'ACTIVA',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioCentavos" INTEGER NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "maxParqueaderos" INTEGER NOT NULL,
    "maxEspaciosPorParqueadero" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "estado" "EstadoSuscripcion" NOT NULL DEFAULT 'PRUEBA',
    "finPeriodoActual" TIMESTAMP(3) NOT NULL,
    "clienteExternoId" TEXT,
    "suscripcionExternaId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'CLIENTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "emailVerificadoEn" TIMESTAMP(3),
    "organizacionId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_renovacion" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "revocadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_renovacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parqueaderos" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "precioPorHoraCentavos" INTEGER NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "horaApertura" TEXT,
    "horaCierre" TEXT,
    "estado" "EstadoParqueadero" NOT NULL DEFAULT 'ACTIVO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parqueaderos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas_parqueo" (
    "id" TEXT NOT NULL,
    "parqueaderoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zonas_parqueo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "espacios_parqueo" (
    "id" TEXT NOT NULL,
    "parqueaderoId" TEXT NOT NULL,
    "zonaId" TEXT,
    "numeroEspacio" TEXT NOT NULL,
    "tipoVehiculo" "TipoVehiculo" NOT NULL DEFAULT 'AUTO',
    "estado" "EstadoEspacio" NOT NULL DEFAULT 'DISPONIBLE',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espacios_parqueo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "tipoVehiculo" "TipoVehiculo" NOT NULL DEFAULT 'AUTO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "espacioParqueoId" TEXT NOT NULL,
    "vehiculoId" TEXT,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "montoCentavos" INTEGER NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizaciones_slug_key" ON "organizaciones"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "planes_nombre_key" ON "planes"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_organizacionId_key" ON "suscripciones"("organizacionId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_renovacion_tokenHash_key" ON "tokens_renovacion"("tokenHash");

-- CreateIndex
CREATE INDEX "tokens_renovacion_usuarioId_idx" ON "tokens_renovacion"("usuarioId");

-- CreateIndex
CREATE INDEX "parqueaderos_latitud_longitud_idx" ON "parqueaderos"("latitud", "longitud");

-- CreateIndex
CREATE UNIQUE INDEX "zonas_parqueo_parqueaderoId_nombre_key" ON "zonas_parqueo"("parqueaderoId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "espacios_parqueo_parqueaderoId_numeroEspacio_key" ON "espacios_parqueo"("parqueaderoId", "numeroEspacio");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_usuarioId_placa_key" ON "vehiculos"("usuarioId", "placa");

-- CreateIndex
CREATE INDEX "reservas_espacioParqueoId_horaInicio_horaFin_idx" ON "reservas"("espacioParqueoId", "horaInicio", "horaFin");

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_renovacion" ADD CONSTRAINT "tokens_renovacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parqueaderos" ADD CONSTRAINT "parqueaderos_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "organizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas_parqueo" ADD CONSTRAINT "zonas_parqueo_parqueaderoId_fkey" FOREIGN KEY ("parqueaderoId") REFERENCES "parqueaderos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "espacios_parqueo" ADD CONSTRAINT "espacios_parqueo_parqueaderoId_fkey" FOREIGN KEY ("parqueaderoId") REFERENCES "parqueaderos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "espacios_parqueo" ADD CONSTRAINT "espacios_parqueo_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zonas_parqueo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_espacioParqueoId_fkey" FOREIGN KEY ("espacioParqueoId") REFERENCES "espacios_parqueo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
