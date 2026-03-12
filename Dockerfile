FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies for building
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and configs needed for build
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

# Build TypeScript -> dist
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runtime

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy built JS from build stage
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]

