# Use official Node LTS with explicit version for reproducibility
FROM node:18-alpine

# Add dependencies required for health check
RUN apk --no-cache add curl

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --production && \
    # Remove npm cache
    npm cache clean --force && \
    # Create non-root user
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    # Fix permissions
    chown -R appuser:appgroup /usr/src/app

# Copy source with proper ownership
COPY --chown=appuser:appgroup . .

# Expose the service port
EXPOSE 5002

# Switch to non-root user for security
USER appuser

# Health check to verify service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5002/health || exit 1

# Set NODE_ENV
ENV NODE_ENV=production

# Start the service
CMD ["node", "src/server.js"]
