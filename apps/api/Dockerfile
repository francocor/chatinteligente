# ===========================================================
# API Dockerfile - Production Ready
# ===========================================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy source for NestJS
COPY apps/api/src ./apps/api/src
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/nest-cli.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/tsconfig.build.json ./apps/api/

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build the application using tsc from within apps/api directory
RUN cd /app/apps/api && npx tsc

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install production dependencies only
RUN npm install --omit=dev

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY apps/api/src/app.module.ts ./
COPY apps/api/src/main.ts ./

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "apps/api/dist/main.js"]

# ===========================================================
# ENVIRONMENT VARIABLES (set at runtime)
# ===========================================================
# DATABASE_URL
# JWT_SECRET
# PORT
# NODE_ENV=production
# LOG_LEVEL=warn