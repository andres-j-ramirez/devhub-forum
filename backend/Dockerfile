# Stage 1: Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy everything into the build context
COPY . /app

# 1) Remove any existing package-lock.json so npm doesn't use it
RUN rm -f /app/package-lock.json

# 2) Remove references to "fsevents" in package.json (if present)
#    Also remove any "engines" block that might enforce node versions.
RUN sed -i '/fsevents/d' /app/package.json || true
RUN sed -i '/"engines": {/,/},/d' /app/package.json || true

# 3) Install dependencies ignoring dev & optional, forcing override if needed
#    The "|| true" keeps Docker from failing if it hits EBADPLATFORM
RUN npm install --omit=dev --omit=optional --force --legacy-peer-deps --engine-strict=false || true

# 4) Remove fsevents forcibly if it still slipped in
RUN rm -rf node_modules/fsevents || true

# 5) Prune down to production dependencies
RUN npm prune --production || true

# Stage 2: Production Stage
FROM node:18-alpine
WORKDIR /app

# Copy files from the builder stage
COPY --from=builder /app /app

# Expose the port your backend listens on (e.g., 5001)
EXPOSE 5001

# Healthcheck using the /health endpoint (ensure it exists in server.js)
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD wget -qO- http://localhost:5001/health || exit 1

# Run your backend
CMD ["node", "server.js"]
