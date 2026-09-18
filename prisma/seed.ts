import 'dotenv/config';
import { PrismaClient, Rol } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? 'Password123!';

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('El seed de datos de prueba no debe ejecutarse con NODE_ENV=production.');
  }

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

  const planGratuito = await prisma.plan.upsert({
    where: { nombre: 'Free Trial' },
    update: {},
    create: {
      nombre: 'Free Trial',
      descripcion: 'Plan de prueba gratuito por 14 días',
      precioCentavos: 0,
      maxParqueaderos: 1,
      maxEspaciosPorParqueadero: 20,
    },
  });

  await prisma.plan.upsert({
    where: { nombre: 'Pro' },
    update: {},
    create: {
      nombre: 'Pro',
      descripcion: 'Hasta 5 parqueos y 100 cupos por parqueo',
      precioCentavos: 4999,
      maxParqueaderos: 5,
      maxEspaciosPorParqueadero: 100,
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'super-admin@parqueo.com' },
    update: {},
    create: {
      email: 'super-admin@parqueo.com',
      nombre: 'Super Admin',
      password: hashedPassword,
      rol: Rol.SUPER_ADMIN,
      emailVerificadoEn: new Date(),
    },
  });

  const organizacionDemo = await prisma.organizacion.upsert({
    where: { slug: 'parqueo-demo' },
    update: {},
    create: {
      nombre: 'Parqueo Demo S.A.',
      slug: 'parqueo-demo',
    },
  });

  await prisma.suscripcion.upsert({
    where: { organizacionId: organizacionDemo.id },
    update: {},
    create: {
      organizacionId: organizacionDemo.id,
      planId: planGratuito.id,
      estado: 'PRUEBA',
      finPeriodoActual: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'owner@parqueo-demo.com' },
    update: {},
    create: {
      email: 'owner@parqueo-demo.com',
      nombre: 'Dueño Demo',
      password: hashedPassword,
      rol: Rol.PROPIETARIO,
      organizacionId: organizacionDemo.id,
      emailVerificadoEn: new Date(),
    },
  });

  const parqueaderoDemo = await prisma.parqueadero.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      organizacionId: organizacionDemo.id,
      nombre: 'Parqueo Centro',
      direccion: 'Av. Principal 123',
      latitud: -0.1807,
      longitud: -78.4678,
      precioPorHoraCentavos: 100,
      horaApertura: '06:00',
      horaCierre: '22:00',
    },
  });

  for (let i = 1; i <= 5; i++) {
    const numeroEspacio = `A-${i.toString().padStart(2, '0')}`;
    await prisma.espacioParqueo.upsert({
      where: {
        parqueaderoId_numeroEspacio: {
          parqueaderoId: parqueaderoDemo.id,
          numeroEspacio,
        },
      },
      update: {},
      create: {
        parqueaderoId: parqueaderoDemo.id,
        numeroEspacio,
      },
    });
  }

  await prisma.usuario.upsert({
    where: { email: 'cliente@ejemplo.com' },
    update: {},
    create: {
      email: 'cliente@ejemplo.com',
      nombre: 'Cliente Demo',
      password: hashedPassword,
      rol: Rol.CLIENTE,
      emailVerificadoEn: new Date(),
    },
  });

  console.log(
    '✅ Seed completado. Usuarios de prueba creados (contraseña definida en SEED_PASSWORD):',
  );
  console.log('   - super-admin@parqueo.com (SUPER_ADMIN)');
  console.log('   - owner@parqueo-demo.com (PROPIETARIO)');
  console.log('   - cliente@ejemplo.com (CLIENTE)');
}

main()
  .catch((error) => {
    console.error('❌ Error al ejecutar el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
