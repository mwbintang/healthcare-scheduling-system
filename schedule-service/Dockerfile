# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set a default DATABASE_URL for build-time Prisma client generation
# (can be overridden at runtime via environment)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-"file:./dev.db"}

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# ---------- RUN STAGE ----------
FROM node:22-alpine

WORKDIR /app

# Copy built app and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Expose service port (override via environment if needed)
ARG PORT
ENV PORT=${PORT:-3002}
EXPOSE ${PORT}

# Run migrations and start app
# DATABASE_URL must be set at runtime via environment variables
CMD ["sh", "-c", "npx prisma migrate deploy --config ./prisma.config.ts --schema prisma/schema.prisma && node dist/src/main.js"]
