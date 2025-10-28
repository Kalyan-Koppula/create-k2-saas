import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">K2-SaaS Template</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* API Section */}
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Available endpoints and their descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Users</h3>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-muted px-1">GET /api/users</code> - List all users</li>
                <li><code className="bg-muted px-1">POST /api/users</code> - Create a new user</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Posts</h3>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-muted px-1">GET /api/posts</code> - List all posts</li>
                <li><code className="bg-muted px-1">POST /api/posts</code> - Create a new post</li>
                <li><code className="bg-muted px-1">GET /api/posts/:id</code> - Get a post by ID</li>
                <li><code className="bg-muted px-1">PATCH /api/posts/:id</code> - Update a post</li>
                <li><code className="bg-muted px-1">DELETE /api/posts/:id</code> - Delete a post</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>
              Technologies used in this template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li>
                <strong className="block">Frontend</strong>
                <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                  <li>React with TypeScript</li>
                  <li>ShadcnUI Components</li>
                  <li>Zustand for State Management</li>
                  <li>React Router for Navigation</li>
                  <li>TailwindCSS for Styling</li>
                </ul>
              </li>
              <li>
                <strong className="block">Backend</strong>
                <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                  <li>Cloudflare Workers</li>
                  <li>D1 Database (SQLite)</li>
                  <li>Drizzle ORM</li>
                  <li>Hono for API Routing</li>
                </ul>
              </li>
              <li>
                <strong className="block">Shared</strong>
                <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                  <li>pnpm Workspace</li>
                  <li>Turborepo for Build System</li>
                  <li>Zod for Schema Validation</li>
                  <li>Shared TypeScript Types</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}