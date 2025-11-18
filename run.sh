#!/bin/bash

echo "Starting Library Spring Boot Application..."

# Set the JAR and YAML file paths
JAR_FILE="runtime/library.jar"
CONFIG_FILE="runtime/application.yaml"

while true
do
    echo
    echo "Starting server..."
    java -jar "$JAR_FILE" --spring.config.location=file:"$CONFIG_FILE"

    echo
    echo "Server exited. Restarting in 5 seconds. Press Ctrl+C to cancel."
    sleep 5
done
