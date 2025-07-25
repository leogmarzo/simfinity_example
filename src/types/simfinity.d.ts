declare module '@simtlix/simfinity-js' {
  import { GraphQLSchema, GraphQLObjectType } from 'graphql';

  interface SimfinityMiddlewareParams {
    type?: any;
    args: any;
    operation: string;
    context: any;
    actionName?: string;
    actionField?: any;
    entry?: string;
  }

  interface SimfinityController {
    onSaving?: (doc: any, args: any, session: any) => Promise<void>;
    onSaved?: (doc: any, args: any, session: any) => Promise<void>;
    onUpdating?: (id: string, doc: any, session: any) => Promise<void>;
    onUpdated?: (doc: any, session: any) => Promise<void>;
    onDelete?: (doc: any, session: any) => Promise<void>;
  }

  interface SimfinityStateMachine {
    initialState: any;
    actions: Record<string, any>;
  }

  export function connect(
    mongooseModel: any,
    graphQLType: GraphQLObjectType,
    singularEndpointName: string,
    pluralEndpointName: string,
    controller?: SimfinityController,
    onModelCreated?: Function,
    stateMachine?: SimfinityStateMachine
  ): void;
  
  export function addNoEndpointType(graphQLType: GraphQLObjectType): void;
  
  export function createSchema(
    includedQueryTypes?: string[],
    includedMutationTypes?: string[],
    includedCustomMutations?: string[]
  ): GraphQLSchema;
  
  export function use(middleware: (params: SimfinityMiddlewareParams, next: () => void) => void): void;
  
  export function getType(typeName: string): GraphQLObjectType | null;
  
  export function getModel(gqltype: GraphQLObjectType): any;
  
  export function getInputType(type: GraphQLObjectType): any;
  
  export function saveObject(typeName: string, args: any, session?: any): Promise<any>;
  
  export function registerMutation(
    name: string,
    description: string,
    inputType: any,
    outputType: any,
    resolver: (args: any, session: any) => Promise<any>
  ): void;
  
  export function buildErrorFormatter(callback: (err: any) => void): (err: any) => any;
  
  export function preventCreatingCollection(prevent: boolean): void;
  
  export class SimfinityError extends Error {
    constructor(message: string, code: string, statusCode: number);
  }
}
