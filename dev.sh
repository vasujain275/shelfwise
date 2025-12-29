#!/bin/bash

set -e  # Exit on error

# Define relative paths
WEB_DIR="web"
SPRING_DIR="api"
RUNTIME_DIR="runtime"
JAR_NAME="shelfwise.jar"
FINAL_JAR_NAME="shelfwise.jar"
CONFIG_FILE="$SPRING_DIR/src/main/resources/application.yaml"
STATIC_DIR="$SPRING_DIR/src/main/resources/static"

echo "➡️ Building frontend..."
cd "$WEB_DIR"
pnpm install
pnpm run build
cd - >/dev/null

echo "✅ Frontend build complete."

echo "➡️ Updating Spring Boot static files..."
# cp "$STATIC_DIR/openapi.yaml" "$WEB_DIR/dist/"
rm -rf "$STATIC_DIR"/*
cp -r "$WEB_DIR/dist/"* "$STATIC_DIR"

echo "✅ Static files copied."

echo "➡️ Building Spring Boot backend..."
cd "$SPRING_DIR"
mvn clean package -DskipTests
cd - >/dev/null

echo "✅ Backend built."

echo "➡️ Preparing runtime folder..."
cp "$SPRING_DIR/target/$JAR_NAME" "$RUNTIME_DIR/$FINAL_JAR_NAME"
cp "$CONFIG_FILE" "$RUNTIME_DIR/"

echo "🚀 Starting application..."
while true; do
    java -jar "$RUNTIME_DIR/$FINAL_JAR_NAME" --spring.config.location="$RUNTIME_DIR/application.yaml" || true
    echo "Server exited. Restarting in 5 seconds. Press Ctrl+C to cancel."
    sleep 5
done
