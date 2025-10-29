import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.number(),
});

export const CreateUserPayloadSchema = UserSchema.omit({
  id: true,
  created_at: true,
});

// Post schemas
export const PostSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  content: z.string(),
  author_id: z.number(),
  created_at: z.number(),
  updated_at: z.number(),
  author: UserSchema.optional(),
});

export const CreatePostPayloadSchema = PostSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  author: true,
});

export const UpdatePostPayloadSchema = CreatePostPayloadSchema.partial();

// Response wrappers
export const ApiResponseSchema = z.object({
  ok: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;
export type Post = z.infer<typeof PostSchema>;
export type CreatePostPayload = z.infer<typeof CreatePostPayloadSchema>;
export type UpdatePostPayload = z.infer<typeof UpdatePostPayloadSchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};
