# K2-SaaS Template

A modern, self-documenting SaaS template using React, TypeScript, and Cloudflare Workers.

## Features

- 🚀 Full-stack TypeScript development
- 📦 Monorepo structure with pnpm workspaces
- ⚡ Fast builds with Turborepo
- 🎨 Beautiful UI with ShadcnUI and TailwindCSS
- 🔍 End-to-end type safety with Zod
- 🗄️ SQLite database with Drizzle ORM
- 🌩️ Serverless API with Cloudflare Workers
- 📝 Self-documenting API and components

## Stack

### Frontend

- React 19 with TypeScript
- ShadcnUI Components
- Zustand for State Management
- React Router for Navigation
- TailwindCSS for Styling

### Backend

- Cloudflare Workers
- D1 Database (SQLite)
- Drizzle ORM
- Hono for API Routing

### Shared

- pnpm Workspace
- Turborepo
- Zod Schema Validation
- Shared TypeScript Types

## Getting Started

1. Bootstrap your application using this template:

   ```bash
   npm create k2-saas my-saas-app
   cd my-saas-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a D1 database:

   ```bash
   cd apps/api
   pnpm wrangler d1 create k2-sass-db
   ```

4. Update `wrangler.toml` with your D1 database ID

5. Push the database schema:

   ```bash
   pnpm db:push
   ```

6. Start the development servers:
   ```bash
   # In the root directory
   pnpm dev
   ```

## Project Structure

```
k2-sass/
├── apps/
│   ├── api/              # Cloudflare Worker API
│   │   ├── src/
│   │   │   ├── db/      # Database schema and config
│   │   │   └── index.ts # API routes
│   │   └── wrangler.toml
│   │
│   └── web/             # React frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── store/
│       │   └── utils/
│       └── index.html
│
└── packages/
    └── shared-types/    # Shared TypeScript types
        └── src/
            └── schemas.ts
```

## Development Workflow

1. **Database Schema**: Define your database schema in `apps/api/src/db/schema.ts`
2. **API Types**: Add Zod schemas in `packages/shared-types/src/schemas.ts`
3. **API Routes**: Implement routes in `apps/api/src/index.ts`
4. **Frontend State**: Add Zustand stores in `apps/web/src/store`
5. **UI Components**: Create pages and components in `apps/web/src/pages` and `components`

## API Endpoints in the example project

### Users

- `GET /users` - List all users
- `POST /users` - Create a new user

### Posts

- `GET /posts` - List all posts with authors
- `POST /posts` - Create a new post
- `GET /posts/:id` - Get post by ID
- `PATCH /posts/:id` - Update post by ID
- `DELETE /posts/:id` - Delete post by ID

## Type Safety

The template ensures end-to-end type safety through:

1. Zod schemas for API payloads and responses
2. Shared TypeScript types between frontend and backend
3. Drizzle ORM for type-safe database queries
4. React Hook Form with Zod validation

## License

MIT
