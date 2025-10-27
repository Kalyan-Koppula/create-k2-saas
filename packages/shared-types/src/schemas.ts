import { z } from 'zod';

// Payload sent to the worker
export const PostPayloadSchema = z.object({
  name: z.string().min(1),
  message: z.string().optional(),
});

// Response returned by the worker
export const PostResponseSchema = z.object({
  ok: z.boolean(),
  echo: z.object({
    name: z.string(),
    message: z.string().nullable(),
  }),
});

export type PostPayload = z.infer<typeof PostPayloadSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;

export default {};
