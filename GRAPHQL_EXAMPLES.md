# Simfinity.js GraphQL API Examples

Este archivo contiene ejemplos de queries y mutations que puedes usar con tu API GraphQL de ayuno intermitente.

## Queries de ejemplo

### 1. Obtener todos los usuarios
```graphql
query GetUsers {
  users {
    id
    email
    name
    timezone
    preferredMethod
    createdAt
    updatedAt
  }
}
```

### 2. Obtener un usuario específico
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    timezone
    preferredMethod
    fastSessions {
      id
      startAt
      endAt
      method
      comment
      durationMinutes
    }
    measurements {
      id
      takenAt
      weightKg
      bodyFatPercentage
    }
    reminders {
      id
      message
      sendAt
      sent
    }
  }
}
```

### 3. Obtener sesiones de ayuno
```graphql
query GetFastSessions {
  fastSessions {
    id
    startAt
    endAt
    method
    comment
    durationMinutes
    user {
      id
      name
      email
    }
  }
}
```

### 4. Obtener mediciones
```graphql
query GetMeasurements {
  measurements {
    id
    takenAt
    weightKg
    bodyFatPercentage
    user {
      id
      name
    }
  }
}
```

## Mutations de ejemplo

### 1. Crear un usuario
```graphql
mutation CreateUser($user: UserInput!) {
  saveUser(user: $user) {
    id
    email
    name
    timezone
    preferredMethod
    createdAt
  }
}
```

Variables:
```json
{
  "user": {
    "email": "juan@example.com",
    "passwordHash": "hashedpassword123",
    "name": "Juan Pérez",
    "timezone": "America/Argentina/Buenos_Aires",
    "preferredMethod": "16:8"
  }
}
```

### 2. Crear una sesión de ayuno
```graphql
mutation CreateFastSession($fastSession: FastSessionInput!) {
  saveFastSession(fastSession: $fastSession) {
    id
    startAt
    endAt
    method
    comment
    durationMinutes
    user {
      name
    }
  }
}
```

Variables:
```json
{
  "fastSession": {
    "user": "USER_ID_HERE",
    "startAt": "2024-01-15T18:00:00Z",
    "endAt": "2024-01-16T10:00:00Z",
    "method": "16:8",
    "comment": "Me sentí muy bien durante este ayuno"
  }
}
```

### 3. Registrar una medición
```graphql
mutation CreateMeasurement($measurement: MeasurementInput!) {
  saveMeasurement(measurement: $measurement) {
    id
    takenAt
    weightKg
    bodyFatPercentage
    user {
      name
    }
  }
}
```

Variables:
```json
{
  "measurement": {
    "user": "USER_ID_HERE",
    "takenAt": "2024-01-15T08:00:00Z",
    "weightKg": 75.5,
    "bodyFatPercentage": 18.2
  }
}
```

### 4. Crear un recordatorio
```graphql
mutation CreateReminder($reminder: ReminderInput!) {
  saveReminder(reminder: $reminder) {
    id
    message
    sendAt
    sent
    user {
      name
    }
  }
}
```

Variables:
```json
{
  "reminder": {
    "user": "USER_ID_HERE",
    "message": "¡Es hora de comenzar tu ayuno de 16 horas!",
    "sendAt": "2024-01-16T18:00:00Z"
  }
}
```

### 5. Actualizar un usuario
```graphql
mutation UpdateUser($id: ID!, $user: UserInput!) {
  updateUser(id: $id, user: $user) {
    id
    name
    preferredMethod
    timezone
    updatedAt
  }
}
```

Variables:
```json
{
  "id": "USER_ID_HERE",
  "user": {
    "name": "Juan Carlos Pérez",
    "preferredMethod": "18:6",
    "timezone": "America/Argentina/Buenos_Aires"
  }
}
```

## Queries con filtros (Simfinity automático)

### Filtrar sesiones de ayuno por usuario
```graphql
query GetUserFastSessions($userId: ID!) {
  fastSessions(where: { user: $userId }) {
    id
    startAt
    endAt
    method
    durationMinutes
  }
}
```

### Filtrar mediciones por rango de fechas
```graphql
query GetMeasurementsByDateRange($startDate: DateTime!, $endDate: DateTime!) {
  measurements(where: { 
    takenAt: { 
      gte: $startDate, 
      lte: $endDate 
    } 
  }) {
    id
    takenAt
    weightKg
    bodyFatPercentage
    user {
      name
    }
  }
}
```

### Obtener recordatorios pendientes
```graphql
query GetPendingReminders {
  reminders(where: { sent: false }) {
    id
    message
    sendAt
    user {
      name
      email
    }
  }
}
```

## Introspection query
```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

## Notas importantes

1. **Autenticación**: En un entorno de producción, necesitarás implementar autenticación en el contexto de GraphQL.

2. **Validaciones**: Simfinity.js aplica automáticamente las validaciones definidas en los tipos.

3. **Relaciones**: Las relaciones se resuelven automáticamente. Puedes acceder a `user` desde `fastSessions`, `measurements` y `reminders`.

4. **Timestamps**: Los campos `createdAt` y `updatedAt` se manejan automáticamente.

5. **Filtros**: Simfinity.js genera automáticamente filtros para todos los campos. Puedes usar operadores como `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`, etc.

6. **Paginación**: Simfinity.js incluye soporte automático para paginación con `limit`, `offset`, `sort`.

Ejemplo de paginación:
```graphql
query GetPaginatedFastSessions($limit: Int!, $offset: Int!) {
  fastSessions(limit: $limit, offset: $offset, sort: "-createdAt") {
    id
    startAt
    endAt
    method
  }
}
```
