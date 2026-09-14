# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm run prisma:generate
RUN pnpm run build

# Stage 2: Production stage
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile
RUN pnpm run prisma:generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
