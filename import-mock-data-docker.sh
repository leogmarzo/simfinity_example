#!/bin/bash

# Script para importar datos mock usando Docker
# Uso: ./import-mock-data-docker.sh

# Configuración
DB_NAME="simfinity_example"
CONTAINER_NAME="simfinity_mongo"
MOCK_DATA_DIR="./mock-data"

echo "🐳 Importando datos mock a MongoDB (Docker)..."
echo "📂 Base de datos: $DB_NAME"
echo "🔧 Contenedor: $CONTAINER_NAME"
echo ""

# Verificar que el contenedor esté corriendo
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ El contenedor $CONTAINER_NAME no está corriendo"
    echo "💡 Ejecuta: docker-compose up -d mongodb"
    exit 1
fi

# Función para importar una colección usando Docker
import_collection_docker() {
    local file=$1
    local collection=$2
    
    echo "📥 Importando $collection..."
    
    if [ -f "$MOCK_DATA_DIR/$file" ]; then
        # Copiar archivo al contenedor y ejecutar mongoimport
        docker cp "$MOCK_DATA_DIR/$file" "$CONTAINER_NAME:/tmp/$file"
        
        docker exec "$CONTAINER_NAME" mongoimport \
            --db "$DB_NAME" \
            --collection "$collection" \
            --file "/tmp/$file" \
            --jsonArray \
            --drop
        
        if [ $? -eq 0 ]; then
            echo "✅ $collection importado correctamente"
        else
            echo "❌ Error importando $collection"
        fi
        
        # Limpiar archivo temporal
        docker exec "$CONTAINER_NAME" rm "/tmp/$file"
    else
        echo "❌ Archivo no encontrado: $MOCK_DATA_DIR/$file"
    fi
    echo ""
}

# Importar cada colección
import_collection_docker "users.json" "User"
import_collection_docker "fastsessions.json" "FastSession"
import_collection_docker "measurements.json" "Measurement"
import_collection_docker "reminders.json" "Reminder"

echo "🎉 Importación completada!"
echo ""
echo "📊 Para verificar los datos:"
echo "docker exec $CONTAINER_NAME mongosh $DB_NAME --eval 'db.users.countDocuments()'"
echo "docker exec $CONTAINER_NAME mongosh $DB_NAME --eval 'db.fastsessions.countDocuments()'"
echo "docker exec $CONTAINER_NAME mongosh $DB_NAME --eval 'db.measurements.countDocuments()'"
echo "docker exec $CONTAINER_NAME mongosh $DB_NAME --eval 'db.reminders.countDocuments()'"
