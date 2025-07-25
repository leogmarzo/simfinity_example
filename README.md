# Simfinity Example App

This is a [Next.js](https://nextjs.org) project set up for backend development and testing. The project includes TypeScript support, API routes, and a clean project structure.

## Features

- ✅ Next.js with App Router
- ✅ TypeScript support
- ✅ ESLint configuration
- ✅ API routes for backend functionality
- ✅ Development server with Turbopack

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

- `GET /api/hello` - Basic API endpoint with optional name parameter
- `POST /api/hello` - POST endpoint that echoes received data
- `GET /[slug]` - Dynamic route example

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── hello/
│   │       └── route.ts     # API endpoint
│   ├── [slug]/
│   │   └── route.ts         # Dynamic API route
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── route.ts             # Root API route
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
