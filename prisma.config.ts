import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --transpile-only prisma/seed.ts',
  },
  datasource: {
    // Prisma CLI (migrate/introspect) necesita la conexión directa, sin pgbouncer.
    // Se usa process.env en vez de env() porque `prisma generate` (en el build de
    // Docker) carga este archivo sin que DIRECT_URL exista todavía, y env() lanza
    // un error si la variable no está definida.
    url: process.env.DIRECT_URL,
  },
});
