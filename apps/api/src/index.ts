import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';
import { sql, eq } from 'drizzle-orm';

interface Env {
  DB: D1Database;
}

export type ApiContext = Context<{ Bindings: Env }>;
import { 
  CreatePostPayloadSchema, 
  CreateUserPayloadSchema,
  UpdatePostPayloadSchema 
} from '@k2-saas/shared-types';
import { getDb } from './db';
import { users, posts } from './db/schema';

const app = new Hono<{ Bindings: Env }>();

// Type for API responses
type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
};

type ApiErrorResponse = {
  ok: false;
  error: string;
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Enable CORS
app.use('*', cors());

// Documentation route
app.get('/', c => {
  return c.json({
    ok: true,
    data: {
      name: 'K2-SaaS Template API',
      version: '1.0.0',
      endpoints: [
        { path: '/', method: 'GET', description: 'API documentation' },
        { path: '/users', method: 'GET', description: 'List all users' },
        { path: '/users', method: 'POST', description: 'Create a new user' },
        { path: '/posts', method: 'GET', description: 'List all posts with authors' },
        { path: '/posts', method: 'POST', description: 'Create a new post' },
        { path: '/posts/:id', method: 'GET', description: 'Get post by ID' },
        { path: '/posts/:id', method: 'PATCH', description: 'Update post by ID' },
        { path: '/posts/:id', method: 'DELETE', description: 'Delete post by ID' },
      ]
    }
  } satisfies ApiResponse<{
    name: string;
    version: string;
    endpoints: { path: string; method: string; description: string; }[];
  }>);
});

// User routes
app.get('/users', async c => {
  const db = getDb(c);
  const allUsers = await db.select().from(users);
  const response: ApiSuccessResponse<typeof allUsers> = { ok: true, data: allUsers };
  return c.json(response);
});

app.post('/users', async c => {
  try {
    const json = await c.req.json();
    const payload = CreateUserPayloadSchema.parse(json);
    
    const db = getDb(c);
    const [user] = await db.insert(users).values(payload).returning();
    
    const response: ApiSuccessResponse<typeof user> = { ok: true, data: user };
    return c.json(response);
  } catch (err: any) {
    const errorResponse: ApiErrorResponse = { ok: false, error: err?.message ?? 'Invalid request' };
    return c.json(errorResponse, 400);
  }
});

// Post routes
app.get('/posts', async c => {
  const db = getDb(c);
  const allPosts = await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    author_id: posts.author_id,
    created_at: posts.created_at,
    updated_at: posts.updated_at,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
      created_at: users.created_at,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.author_id, users.id));
  
  // Transform the data to handle timestamps and author
  const transformedPosts = allPosts.map(post => {
    const author = post.author?.id ? {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
      created_at: post.author.created_at ? Math.floor(new Date(post.author.created_at).getTime() / 1000) : null
    } : null;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author_id: post.author_id,
      author,
      created_at: post.created_at ? Math.floor(new Date(post.created_at).getTime() / 1000) : null,
      updated_at: post.updated_at ? Math.floor(new Date(post.updated_at).getTime() / 1000) : null
    };
  });
  
  const response: ApiSuccessResponse<typeof transformedPosts> = { ok: true, data: transformedPosts };
  return c.json(response);
});

app.post('/posts', async (c: ApiContext) => {
  try {
    const json = await c.req.json();
    const validatedData = CreatePostPayloadSchema.parse(json);
    
    const db = getDb(c);
    
    // Ensure numeric author_id and remove any potential null values
    const insertData = {
      title: validatedData.title.trim(),
      content: validatedData.content.trim(),
      author_id: Number(validatedData.author_id)
    };
    
    // Check if author exists
    const author = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, insertData.author_id))
      .get();
    
    if (!author) {
      const errorResponse: ApiErrorResponse = { ok: false, error: 'Author not found' };
      return c.json(errorResponse, 400);
    }
    
    // Create the post
    const [createdPost] = await db
      .insert(posts)
      .values({
        ...insertData,
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`
      })
      .returning({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author_id: posts.author_id,
        created_at: posts.created_at,
        updated_at: posts.updated_at
      });
    
    if (!createdPost) {
      const errorResponse: ApiErrorResponse = { ok: false, error: 'Failed to create post' };
      return c.json(errorResponse, 500);
    }

    // Fetch the post with author information
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author_id: posts.author_id,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          created_at: users.created_at
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.author_id, users.id))
      .where(eq(posts.id, createdPost.id));

    // Transform timestamps
    const transformedPost = {
      ...post,
      created_at: post.created_at ? Math.floor(new Date(post.created_at).getTime() / 1000) : null,
      updated_at: post.updated_at ? Math.floor(new Date(post.updated_at).getTime() / 1000) : null,
      author: post.author?.id ? {
        ...post.author,
        created_at: post.author.created_at ? Math.floor(new Date(post.author.created_at).getTime() / 1000) : null
      } : null
    };
    
    const response: ApiSuccessResponse<typeof transformedPost> = { ok: true, data: transformedPost };
    return c.json(response);
  } catch (err: any) {
    const errorResponse: ApiErrorResponse = { 
      ok: false, 
      error: err instanceof Error ? err.message : 'Failed to create post' 
    };
    return c.json(errorResponse, 400);
  }
});

app.get('/posts/:id', async c => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    const errorResponse: ApiErrorResponse = { ok: false, error: 'Invalid post ID' };
    return c.json(errorResponse, 400);
  }

  const db = getDb(c);
  const post = await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    created_at: posts.created_at,
    updated_at: posts.updated_at,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
      created_at: users.created_at,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.author_id, users.id))
  .where(eq(posts.id, id))
  .limit(1);

  if (!post[0]) {
    const errorResponse: ApiErrorResponse = { ok: false, error: 'Post not found' };
    return c.json(errorResponse, 404);
  }

  const response: ApiSuccessResponse<typeof post[0]> = { ok: true, data: post[0] };
  return c.json(response);
});

app.patch('/posts/:id', async c => {
  try {
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      const errorResponse: ApiErrorResponse = { ok: false, error: 'Invalid post ID' };
      return c.json(errorResponse, 400);
    }

    const json = await c.req.json();
    const payload = UpdatePostPayloadSchema.parse(json);
    
    const db = getDb(c);
    const [post] = await db
      .update(posts)
      .set({ ...payload, updated_at: sql`CURRENT_TIMESTAMP` })
      .where(eq(posts.id, id))
      .returning();
    
    if (!post) {
      const errorResponse: ApiErrorResponse = { ok: false, error: 'Post not found' };
      return c.json(errorResponse, 404);
    }
    
    const response: ApiSuccessResponse<typeof post> = { ok: true, data: post };
    return c.json(response);
  } catch (err: any) {
    const errorResponse: ApiErrorResponse = { ok: false, error: err?.message ?? 'Invalid request' };
    return c.json(errorResponse, 400);
  }
});

app.delete('/posts/:id', async c => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    const errorResponse: ApiErrorResponse = { ok: false, error: 'Invalid post ID' };
    return c.json(errorResponse, 400);
  }

  const db = getDb(c);
  const [post] = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning();
  
  if (!post) {
    const errorResponse: ApiErrorResponse = { ok: false, error: 'Post not found' };
    return c.json(errorResponse, 404);
  }

  const response: ApiSuccessResponse<typeof post> = { ok: true, data: post };
  return c.json(response);
});

export default app;
