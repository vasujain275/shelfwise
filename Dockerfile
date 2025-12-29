# ==================================
# Stage 1: Build Frontend
# ==================================
FROM node:22-alpine AS frontend-builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/web

# Copy package files first for better caching
COPY web/package.json web/pnpm-lock.yaml web/pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY web/ ./

# Build frontend
RUN pnpm run build

# ==================================
# Stage 2: Build Backend
# ==================================
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder

WORKDIR /app/api

# Copy pom.xml first for better caching
COPY api/pom.xml ./

# Download dependencies (cached if pom.xml hasn't changed)
RUN mvn dependency:go-offline -B

# Copy source code
COPY api/src ./src

# Copy built frontend static files to Spring Boot resources
COPY --from=frontend-builder /app/web/dist ./src/main/resources/static

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests -B

# ==================================
# Stage 3: Runtime
# ==================================
FROM eclipse-temurin:21-jre-alpine

# Add metadata labels
LABEL maintainer="ShelfWise Team"
LABEL description="ShelfWise Library Management System"
LABEL version="1.0.0"

# Create a non-root user for security
RUN addgroup -g 1001 -S shelfwise && \
    adduser -u 1001 -S shelfwise -G shelfwise

WORKDIR /app

# Create directories for runtime files
RUN mkdir -p /app/logs /app/uploads && \
    chown -R shelfwise:shelfwise /app

# Copy the JAR from builder
COPY --from=backend-builder /app/api/target/shelfwise.jar ./shelfwise.jar

# Switch to non-root user
USER shelfwise

# Expose the application port
EXPOSE 9080

# Health check
# Note: Adjust the path based on your application's health endpoint
# If Spring Boot Actuator is not enabled, use a simple endpoint like the root path
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9080/ || exit 1# Set JVM options for optimal container performance
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:+UseG1GC \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom"

# Run the application
# Config file should be mounted at runtime via volume or ConfigMap
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar shelfwise.jar ${SPRING_OPTS}"]
