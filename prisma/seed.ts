import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!', SALT_ROUNDS);

  const freePlan = await prisma.plan.upsert({
    where: { name: 'Free Trial' },
    update: {},
    create: {
      name: 'Free Trial',
      description: 'Plan de prueba gratuito por 14 días',
      priceCents: 0,
      maxParkingLots: 1,
      maxSpotsPerLot: 20,
    },
  });

  await prisma.plan.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      description: 'Hasta 5 parqueos y 100 cupos por parqueo',
      priceCents: 4999,
      maxParkingLots: 5,
      maxSpotsPerLot: 100,
    },
  });

  await prisma.user.upsert({
    where: { email: 'super-admin@parqueo.com' },
    update: {},
    create: {
      email: 'super-admin@parqueo.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'parqueo-demo' },
    update: {},
    create: {
      name: 'Parqueo Demo S.A.',
      slug: 'parqueo-demo',
    },
  });

  await prisma.subscription.upsert({
    where: { organizationId: demoOrg.id },
    update: {},
    create: {
      organizationId: demoOrg.id,
      planId: freePlan.id,
      status: 'TRIALING',
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.user.upsert({
    where: { email: 'owner@parqueo-demo.com' },
    update: {},
    create: {
      email: 'owner@parqueo-demo.com',
      name: 'Dueño Demo',
      password: hashedPassword,
      role: Role.OWNER,
      organizationId: demoOrg.id,
      emailVerifiedAt: new Date(),
    },
  });

  const demoLot = await prisma.parkingLot.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      organizationId: demoOrg.id,
      name: 'Parqueo Centro',
      address: 'Av. Principal 123',
      latitude: -0.1807,
      longitude: -78.4678,
      pricePerHourCents: 100,
      openingTime: '06:00',
      closingTime: '22:00',
    },
  });

  for (let i = 1; i <= 5; i++) {
    const spotNumber = `A-${i.toString().padStart(2, '0')}`;
    await prisma.parkingSpot.upsert({
      where: {
        parkingLotId_spotNumber: {
          parkingLotId: demoLot.id,
          spotNumber,
        },
      },
      update: {},
      create: {
        parkingLotId: demoLot.id,
        spotNumber,
      },
    });
  }

  await prisma.user.upsert({
    where: { email: 'cliente@ejemplo.com' },
    update: {},
    create: {
      email: 'cliente@ejemplo.com',
      name: 'Cliente Demo',
      password: hashedPassword,
      role: Role.CUSTOMER,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Seed completado. Credenciales de prueba (password: Password123!):');
  console.log('   - super-admin@parqueo.com (SUPER_ADMIN)');
  console.log('   - owner@parqueo-demo.com (OWNER)');
  console.log('   - cliente@ejemplo.com (CUSTOMER)');
}

main()
  .catch((error) => {
    console.error('❌ Error al ejecutar el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
