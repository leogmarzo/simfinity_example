import { connect, createSchema, use } from '@simtlix/simfinity-js';
import { UserType, FastSessionType, MeasurementType, ReminderType } from './types';
import connectToDatabase from '../lib/database';
import mongoose from 'mongoose';

// Modelos de Mongoose - evitar registrar múltiples veces
function getOrCreateModel(name: string, schema: any, collection: string) {
  try {
    return mongoose.model(name);
  } catch (error) {
    return mongoose.model(name, schema, collection);
  }
}

const UserModel = getOrCreateModel('User', new mongoose.Schema({}, { strict: false }), 'users');
const FastSessionModel = getOrCreateModel('FastSession', new mongoose.Schema({}, { strict: false }), 'fast_sessions');
const MeasurementModel = getOrCreateModel('Measurement', new mongoose.Schema({}, { strict: false }), 'measurements');
const ReminderModel = getOrCreateModel('Reminder', new mongoose.Schema({}, { strict: false }), 'reminders');

// Variable para controlar si ya está inicializado
let isInitialized = false;

// Configuración de Simfinity
export async function initializeSimfinity() {
  if (isInitialized) return;
  
  await connectToDatabase();
  
  // Conectar tipos con modelos de Mongoose
  connect(UserModel, UserType, 'user', 'users');
  connect(FastSessionModel, FastSessionType, 'fastSession', 'fastSessions');
  connect(MeasurementModel, MeasurementType, 'measurement', 'measurements');
  connect(ReminderModel, ReminderType, 'reminder', 'reminders');
  
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
