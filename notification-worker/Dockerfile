# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build NestJS (compile TS → dist)
RUN npm run build

# ---------- RUN STAGE ----------
FROM node:22-alpine

WORKDIR /app

# Copy only what is needed
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Worker does NOT expose ports

ENV NODE_ENV=production

# Start worker (no HTTP)
CMD ["node", "dist/main.js"]
