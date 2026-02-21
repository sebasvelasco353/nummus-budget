# -----------------------------
# Build stage
# -----------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./

# Copy workspace manifests
COPY apps/frontend/package.json apps/frontend/
# COPY packages/shared-types/package.json packages/shared-types/

# Install dependencies
RUN npm ci

# Copy full source
COPY . .

# Build shared-types first (if frontend depends on it)
# RUN npm run build --workspace=packages/shared-types

# Build frontend
RUN npm run build --workspace=apps/frontend

# -----------------------------
# Production stage
# -----------------------------
FROM nginx:1.25-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]