# -----------------------------
# 1️⃣ Build stage
# -----------------------------
FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
# COPY packages/shared-types/package.json packages/shared-types/

RUN npm ci

COPY . .

# RUN npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/backend

# -----------------------------
# 2️⃣ Runtime stage
# -----------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy full node_modules from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy backend dist
COPY --from=build /app/apps/backend/dist ./dist

# Copy backend package.json (optional but good practice)
COPY apps/backend/package.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]