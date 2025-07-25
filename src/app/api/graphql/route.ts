import { NextRequest, NextResponse } from 'next/server';
import { getGraphQLSchema, executeGraphQL } from '../../../graphql/simfinity';

// Handle GraphQL playground in development
async function getPlaygroundHTML() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>GraphQL Playground</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
      <link rel="shortcut icon" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" />
      <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
    </head>
    <body>
      <div id="root">
        <style>
          body {
            background-color: rgb(23, 42, 58);
            font-family: Open Sans, sans-serif;
            height: 90vh;
          }
          #root {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading {
            font-size: 32px;
            font-weight: 200;
            color: rgba(255, 255, 255, .6);
            margin-left: 20px;
          }
          img {
            width: 78px;
            height: 78px;
          }
          .title {
            font-weight: 400;
          }
        </style>
        <img src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/logo.png" alt="" />
        <div class="loading"> Loading
          <span class="title">GraphQL Playground</span>
        </div>
      </div>
      <script>window.addEventListener('load', function (event) {
          GraphQLPlayground.init(document.getElementById('root'), {
            endpoint: '/api/graphql'
          })
        })</script>
    </body>
    </html>
  `;
}

export async function GET(request: NextRequest) {
  // En desarrollo, mostrar GraphQL Playground
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get('accept') || '';
    
    // Si es una petición del navegador, mostrar playground
    if (acceptHeader.includes('text/html')) {
      const html = await getPlaygroundHTML();
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }

  // Para peticiones GET de GraphQL (queries via GET)
  const url = new URL(request.url);
  const query = url.searchParams.get('query');
  const variables = url.searchParams.get('variables');
  const operationName = url.searchParams.get('operationName');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const result = await executeGraphQL(
      query,
      variables ? JSON.parse(variables) : undefined,
      { request }
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('GraphQL Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables, operationName } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await executeGraphQL(query, variables, { request });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('GraphQL Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
