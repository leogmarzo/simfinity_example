import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

// Declaraciones de tipos para evitar errores de TypeScript
let UserType: GraphQLObjectType<any, any>;
let FastSessionType: GraphQLObjectType<any, any>;
let MeasurementType: GraphQLObjectType<any, any>;
let ReminderType: GraphQLObjectType<any, any>;

// User Type
UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { 
      type: new GraphQLNonNull(GraphQLString),
      extensions: {
        unique: true,
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: string) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                throw new Error('Invalid email format');
              }
            }
          }],
          update: [{
            validate: async (typeName: string, fieldName: string, value: string) => {
              if (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                  throw new Error('Invalid email format');
                }
              }
            }
          }]
        }
      }
    },
    passwordHash: { 
      type: new GraphQLNonNull(GraphQLString),
      extensions: {
        readOnly: true
      }
    },
    name: { 
      type: new GraphQLNonNull(GraphQLString),
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: string) => {
              if (!value || value.trim().length < 2) {
                throw new Error('Name must be at least 2 characters');
              }
            }
          }]
        }
      }
    },
    timezone: { 
      type: GraphQLString,
      defaultValue: 'UTC'
    },
    preferredMethod: { 
      type: GraphQLString,
      defaultValue: '16:8'
    },
    createdAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    },
    updatedAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    },
    // Relaciones - Se resuelven automáticamente con Simfinity
    fastSessions: {
      type: new GraphQLList(FastSessionType),
      extensions: {
        relation: {
          connectionField: 'user',
          displayField: 'method'
        }
      }
    },
    measurements: {
      type: new GraphQLList(MeasurementType),
      extensions: {
        relation: {
          connectionField: 'user',
          displayField: 'weightKg'
        }
      }
    },
    reminders: {
      type: new GraphQLList(ReminderType),
      extensions: {
        relation: {
          connectionField: 'user',
          displayField: 'message'
        }
      }
    }
  })
});

// FastSession Type
FastSessionType = new GraphQLObjectType({
  name: 'FastSession',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    user: {
      type: new GraphQLNonNull(UserType),
      extensions: {
        relation: {
          displayField: 'name'
        }
      }
    },
    startAt: { 
      type: new GraphQLNonNull(GraphQLDateTime),
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: Date) => {
              if (value > new Date()) {
                throw new Error('Start time cannot be in the future');
              }
            }
          }]
        }
      }
    },
    endAt: { 
      type: GraphQLDateTime,
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: Date, session: any, args: any) => {
              if (value && args.startAt && value <= args.startAt) {
                throw new Error('End time must be after start time');
              }
            }
          }]
        }
      }
    },
    method: { 
      type: new GraphQLNonNull(GraphQLString),
      defaultValue: '16:8'
    },
    comment: { type: GraphQLString },
    createdAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    },
    updatedAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    },
    // Campo calculado
    durationMinutes: {
      type: GraphQLInt,
      resolve: (parent: any) => {
        if (parent.startAt && parent.endAt) {
          return Math.floor((new Date(parent.endAt).getTime() - new Date(parent.startAt).getTime()) / (1000 * 60));
        }
        return null;
      }
    }
  })
});

// Measurement Type
MeasurementType = new GraphQLObjectType({
  name: 'Measurement',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    user: {
      type: new GraphQLNonNull(UserType),
      extensions: {
        relation: {
          displayField: 'name'
        }
      }
    },
    takenAt: { 
      type: new GraphQLNonNull(GraphQLDateTime),
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: Date) => {
              if (value > new Date()) {
                throw new Error('Measurement time cannot be in the future');
              }
            }
          }]
        }
      }
    },
    weightKg: { 
      type: GraphQLFloat,
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: number) => {
              if (value !== undefined && (value <= 0 || value > 1000)) {
                throw new Error('Weight must be between 0 and 1000 kg');
              }
            }
          }]
        }
      }
    },
    bodyFatPercentage: { 
      type: GraphQLFloat,
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: number) => {
              if (value !== undefined && (value < 0 || value > 100)) {
                throw new Error('Body fat percentage must be between 0 and 100');
              }
            }
          }]
        }
      }
    },
    createdAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    },
    updatedAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    }
  })
});

// Reminder Type
ReminderType = new GraphQLObjectType({
  name: 'Reminder',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    user: {
      type: new GraphQLNonNull(UserType),
      extensions: {
        relation: {
          displayField: 'name'
        }
      }
    },
    message: { 
      type: new GraphQLNonNull(GraphQLString),
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: string) => {
              if (!value || value.trim().length < 5) {
                throw new Error('Reminder message must be at least 5 characters');
              }
            }
          }]
        }
      }
    },
    sendAt: { 
      type: new GraphQLNonNull(GraphQLDateTime),
      extensions: {
        validations: {
          save: [{
            validate: async (typeName: string, fieldName: string, value: Date) => {
              if (value <= new Date()) {
                throw new Error('Send time must be in the future');
              }
            }
          }]
        }
      }
    },
    sent: { 
      type: new GraphQLNonNull(GraphQLBoolean),
      defaultValue: false
    },
    createdAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    },
    updatedAt: { 
      type: GraphQLDateTime,
      extensions: {
        readOnly: true
      }
    }
  })
});

// Exportar los tipos
export { UserType, FastSessionType, MeasurementType, ReminderType };
