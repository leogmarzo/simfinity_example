# MongoDB Docker Setup

## 🚀 Iniciar MongoDB con Docker

### 1. Levantar los servicios
```bash
docker-compose up -d
```

### 2. Verificar que esté funcionando
```bash
docker-compose ps
```

## 📊 Servicios incluidos

### MongoDB
- **Puerto**: 27017
- **Usuario**: admin
- **Contraseña**: password123
- **Base de datos**: simfinity_example

### Mongo Express (Interfaz web)
- **URL**: http://localhost:8081
- **Descripción**: Interfaz web para administrar MongoDB

## 🛠️ Comandos útiles

### Parar los servicios
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs mongodb
docker-compose logs mongo-express
```

### Reiniciar servicios
```bash
docker-compose restart
```

### Eliminar todo (incluyendo datos)
```bash
docker-compose down -v
```

## 🔧 Configuración

### Variables de entorno (.env.local)
```env
MONGODB_URI=mongodb://localhost:27017/simfinity_example
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=simfinity_example
```

### Conectar desde la aplicación
La aplicación Next.js se conectará automáticamente usando la configuración del archivo `.env.local`.

### Probar la conexión
Visita: http://localhost:3000/api/test-db
