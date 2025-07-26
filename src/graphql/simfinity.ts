import { connect, createSchema, use } from '@simtlix/simfinity-js';
import { UserType, FastSessionType, MeasurementType, ReminderType } from './types';
import connectToDatabase from '../lib/database';

// Variable para controlar si ya está inicializado
let isInitialized = false;

// Configuración de Simfinity
export async function initializeSimfinity() {
  if (isInitialized) return;
  
  await connectToDatabase();
  
  // Simfinity crea automáticamente los modelos basándose en los tipos GraphQL
  connect(null, UserType, 'user', 'users');
  connect(null, FastSessionType, 'fastSession', 'fastSessions');
  connect(null, MeasurementType, 'measurement', 'measurements');
  connect(null, ReminderType, 'reminder', 'reminders');
  
  // Middleware global para timestamps
  use((params, next) => {
    if (params.operation === 'save' && !params.args.id) {
      params.args.createdAt = new Date();
    }
    if (params.operation === 'save' || params.operation === 'update') {
      params.args.updatedAt = new Date();
    }
    next();
  });
  
  isInitialized = true;
}

// Función para obtener el schema GraphQL
export async function getGraphQLSchema() {
  await initializeSimfinity();
  return createSchema();
}

// Función para ejecutar queries GraphQL
export async function executeGraphQL(query: string, variables?: any, context?: any) {
  await initializeSimfinity();
  const schema = createSchema();
  
  // Importar graphql para ejecutar queries
  const { graphql } = await import('graphql');
  
  return graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context
  });
}
