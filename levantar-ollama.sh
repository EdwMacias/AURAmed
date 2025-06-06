#!/bin/bash

# Script para levantar Ollama y correr modelo deepseek:r1-8b

# Paso 1: Verifica si docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Docker no está instalado. Instálalo antes de continuar."
    exit 1
fi

# Paso 2: Agrega NVIDIA container toolkit repo (solo en CentOS/RHEL)
if [ -f /etc/redhat-release ]; then
    echo "Agregando repositorio NVIDIA Container Toolkit para CentOS..."
    curl -s -L https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo \
        | sudo tee /etc/yum.repos.d/nvidia-container-toolkit.repo > /dev/null
fi

# Paso 3: Descarga la imagen de Ollama
echo "Descargando imagen de Ollama..."
docker pull ollama/ollama

# Paso 4: Inicia el contenedor si no está corriendo
if [ ! "$(docker ps -q -f name=ollama)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=ollama)" ]; then
        echo "El contenedor 'ollama' existe detenido. Eliminándolo..."
        docker rm ollama
    fi
    echo "Iniciando contenedor 'ollama'..."
    docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama --gpus all ollama/ollama
else
    echo "El contenedor 'ollama' ya está corriendo."
fi

# Espera breve antes de ejecutar modelo
sleep 3

# Paso 5: Ejecuta el modelo deepseek-r1
echo "Ejecutando modelo deepseek-r1:latest dentro del contenedor..."
docker exec -it ollama ollama run deepseek-r1:latest
docker exec -it ollama ollama run deepseek-r1:7b


#comandos para volver a montar la build de docker que se llama api en este caso

 docker compose build api
 docker compose up -d api