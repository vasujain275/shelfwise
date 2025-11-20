# Docker Deployment Guide

This guide explains how to build and deploy the ShelfWise Library Management System using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum (8GB recommended)
- 10GB free disk space

## 🏗️ Architecture

The application uses a **multi-stage Docker build** for optimal image size and security:

1. **Stage 1 (frontend-builder)**: Builds React frontend with Node.js 22 Alpine
2. **Stage 2 (backend-builder)**: Builds Spring Boot JAR with Maven and Java 21
3. **Stage 3 (runtime)**: Minimal JRE Alpine image (~200MB) with only the JAR and static files

## 🚀 Quick Start (Development)

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

The application will be available at: http://localhost:9080

### 2. Build Docker Image Only

```bash
# Build the image
docker build -t shelfwise:latest .

# Run the container (requires external MySQL)
docker run -d \
  -p 9080:9080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/library_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=rootpassword \
  -e JWT_SECRET=your_secret_key \
  --name shelfwise-app \
  shelfwise:latest
```

## 🔐 Production Deployment

### 1. Set Up Configuration File

```bash
# Copy the example configuration
cp application.yaml.example application.yaml

# Edit the application.yaml file with secure credentials
nano application.yaml
```

**Important**: Update these values in `application.yaml`:
- `spring.datasource.url`: Your MySQL database connection URL
- `spring.datasource.username`: Database username
- `spring.datasource.password`: Strong database password
- `jwt.secret`: Secure random key (use: `openssl rand -hex 32`)
- `app.cookie.domain`: Your production domain
- `app.cookie.secure`: Set to `true` for HTTPS
- Other settings as needed

### 2. Deploy with Production Configuration

```bash
# Build and start with production settings
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Configuration

### Application Configuration File

The application uses `application.yaml` for configuration (similar to the `run.sh` approach). Create your configuration file:

```bash
# Copy the example
cp application.yaml.example application.yaml

# Edit with your settings
nano application.yaml
```

Key configuration sections:

| Section | Description | Example |
|---------|-------------|---------|
| `spring.datasource` | Database connection | MySQL URL, username, password |
| `jwt.secret` | JWT signing secret | 256-bit hex string |
| `jwt.access-token.expiration` | Access token lifetime | 36000 (10 hours in seconds) |
| `jwt.refresh-token.expiration` | Refresh token lifetime | 864000 (240 hours in seconds) |
| `server.port` | Application port | 9080 |
| `app.cookie.domain` | Cookie domain | yourdomain.com |
| `app.cookie.secure` | Use secure cookies | true (for HTTPS) |
| `logging.level` | Logging configuration | INFO, DEBUG, WARN, etc. |

The configuration file is mounted as a read-only volume in the Docker container:
```yaml
volumes:
  - ./application.yaml:/app/config/application.yaml:ro
```

## 📊 Monitoring & Management

### View Logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f mysql

# All logs
docker-compose logs -f
```

### Health Checks

```bash
# Check container health
docker ps

# Check application health endpoint
curl http://localhost:9080/

# If you have Spring Boot Actuator enabled:
# curl http://localhost:9080/actuator/health
```

### Access Container Shell

```bash
# Application container
docker exec -it shelfwise-app sh

# MySQL container
docker exec -it shelfwise-mysql mysql -uroot -p
```

## 💾 Data Management

### Backup Database

```bash
# Create backup directory
mkdir -p ./backups

# Backup database
docker exec shelfwise-mysql mysqldump -uroot -prootpassword library_db > ./backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Restore from backup
docker exec -i shelfwise-mysql mysql -uroot -prootpassword library_db < ./backups/backup_20250118_120000.sql
```

### Persistent Volumes

Data is stored in Docker volumes:
- `mysql_data`: Database files
- `app_logs`: Application logs
- `app_uploads`: User uploads

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect shelfwise_mysql_data

# Backup volume
docker run --rm -v shelfwise_mysql_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/mysql_data.tar.gz -C /data .
```

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Check if port is already in use
lsof -i :9080

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues

```bash
# Check if MySQL is healthy
docker-compose ps

# Test database connection
docker exec shelfwise-mysql mysql -uroot -prootpassword -e "SHOW DATABASES;"

# Check network connectivity
docker exec shelfwise-app ping mysql
```

### Out of Memory

```bash
# Check container resource usage
docker stats

# Increase memory limits in docker-compose.prod.yml
deploy:
  resources:
    limits:
      memory: 4G
```

## 🚢 CI/CD Integration

### Build for Multiple Architectures

```bash
# Build for AMD64 and ARM64
docker buildx build --platform linux/amd64,linux/arm64 -t shelfwise:latest .
```

### Push to Registry

```bash
# Tag image
docker tag shelfwise:latest your-registry.com/shelfwise:latest

# Push to registry
docker push your-registry.com/shelfwise:latest
```

## 📈 Performance Optimization

### Image Size

The final image is optimized:
- Uses Alpine Linux (minimal base)
- Multi-stage build removes build tools
- Only includes JRE (not JDK)
- Size: ~200MB (vs 800MB+ with full JDK)

### JVM Tuning

Default JVM options are optimized for containers:
- `-XX:+UseContainerSupport`: Respects container limits
- `-XX:MaxRAMPercentage=75.0`: Uses 75% of container memory
- `-XX:+UseG1GC`: Modern garbage collector
- `-XX:+UseStringDeduplication`: Reduces memory footprint

## 🔒 Security Best Practices

1. **Never use default passwords** in production
2. **Use Docker secrets** for sensitive data in swarm mode
3. **Run as non-root user** (already configured in Dockerfile)
4. **Keep images updated**: `docker-compose pull && docker-compose up -d`
5. **Use HTTPS** with reverse proxy (nginx/traefik)
6. **Limit container resources** to prevent DoS
7. **Enable firewall rules** for port access

## 📝 Development Tips

### Hot Reload Development

For active development, use the native scripts instead:

```bash
# Frontend (web directory)
cd web && pnpm dev

# Backend (api directory)
cd api && ./mvnw spring-boot:run
```

### Override Docker Compose

Create `docker-compose.override.yml` for local customizations:

```yaml
version: '3.8'
services:
  app:
    ports:
      - "8080:9080"  # Different port
    environment:
      LOGGING_LEVEL_COM_SHELFWISE_LIBRARY: DEBUG
```

## 📚 Additional Resources

- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify configuration: `docker-compose config`
3. Review environment variables
4. Check disk space and memory
