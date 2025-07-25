import simfinity from '@simtlix/simfinity-js';
import mongoose from 'mongoose';
import { UserType, FastSessionType, MeasurementType, ReminderType } from './types';

// Configurar conexión a MongoDB
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI);
}

// Controladores con hooks de ciclo de vida
const userController = {
  onSaving: async (doc: any, args: any, session: any) => {
    // Hash del password antes de guardar
    if (args.input?.password) {
      const bcrypt = require('bcrypt');
      doc.passwordHash = await bcrypt.hash(args.input.password, 10);
    }
    
    // Asignar timestamps
    doc.createdAt = new Date();
    doc.updatedAt = new Date();
    
    console.log(`Creating user: ${doc.name}`);
  },

  onSaved: async (doc: any, args: any, session: any) => {
    console.log(`User saved: ${doc._id} - ${doc.name}`);
  },

  onUpdating: async (id: string, doc: any, session: any) => {
    // Actualizar timestamp
    doc.updatedAt = new Date();
    console.log(`Updating user ${id}`);
  },

  onUpdated: async (doc: any, session: any) => {
    console.log(`User updated: ${doc.name}`);
  },

  onDelete: async (doc: any, session: any) => {
    console.log(`Deleting user: ${doc.name}`);
  }
};

const fastSessionController = {
  onSaving: async (doc: any, args: any, session: any) => {
    doc.createdAt = new Date();
    doc.updatedAt = new Date();
    
    console.log(`Creating fasting session: ${doc.method}`);
  },

  onSaved: async (doc: any, args: any, session: any) => {
    console.log(`Fast session saved: ${doc._id}`);
  },

  onUpdating: async (id: string, doc: any, session: any) => {
    doc.updatedAt = new Date();
    console.log(`Updating fast session ${id}`);
  },

  onUpdated: async (doc: any, session: any) => {
    console.log(`Fast session updated: ${doc._id}`);
  },

  onDelete: async (doc: any, session: any) => {
    console.log(`Deleting fast session: ${doc._id}`);
  }
};

const measurementController = {
  onSaving: async (doc: any, args: any, session: any) => {
    doc.createdAt = new Date();
    doc.updatedAt = new Date();
    
    console.log(`Creating measurement for user: ${doc.user}`);
  },

  onSaved: async (doc: any, args: any, session: any) => {
    console.log(`Measurement saved: ${doc._id}`);
  },

  onUpdating: async (id: string, doc: any, session: any) => {
    doc.updatedAt = new Date();
    console.log(`Updating measurement ${id}`);
  },

  onUpdated: async (doc: any, session: any) => {
    console.log(`Measurement updated: ${doc._id}`);
  },

  onDelete: async (doc: any, session: any) => {
    console.log(`Deleting measurement: ${doc._id}`);
  }
};

const reminderController = {
  onSaving: async (doc: any, args: any, session: any) => {
    doc.createdAt = new Date();
    doc.updatedAt = new Date();
    
    console.log(`Creating reminder: ${doc.message}`);
  },

  onSaved: async (doc: any, args: any, session: any) => {
    console.log(`Reminder saved: ${doc._id}`);
  },

  onUpdating: async (id: string, doc: any, session: any) => {
    doc.updatedAt = new Date();
    console.log(`Updating reminder ${id}`);
  },

  onUpdated: async (doc: any, session: any) => {
    console.log(`Reminder updated: ${doc._id}`);
  },

  onDelete: async (doc: any, session: any) => {
    console.log(`Deleting reminder: ${doc._id}`);
  }
};

// Middlewares globales
simfinity.use((params: any, next: any) => {
  const { operation, type, context } = params;
  console.log(`[${new Date().toISOString()}] Executing ${operation}${type ? ` on ${type.name}` : ''}`);
  next();
});

// // Middleware de autenticación básica (para demo)
// simfinity.use((params: any, next: any) => {
//   const { context, operation } = params;
  
//   // Para operaciones de lectura, no requerir autenticación (para demo)
//   if (operation === 'get_by_id' || operation === 'find') {
//     return next();
//   }
  
//   // Para mutations, verificar si hay usuario (en un entorno real usarías JWT)
//   // Por ahora solo logueamos
//   console.log('Authentication check passed for operation:', operation);
//   next();
// });

// Conectar tipos a Simfinity
simfinity.connect(null, UserType, 'user', 'users', userController);
simfinity.connect(null, FastSessionType, 'fastSession', 'fastSessions', fastSessionController);
simfinity.connect(null, MeasurementType, 'measurement', 'measurements', measurementController);
simfinity.connect(null, ReminderType, 'reminder', 'reminders', reminderController);

// Crear el schema
export const schema = simfinity.createSchema();

// Exportar simfinity para uso en otros archivos
export default simfinity;
