import { buildJsonSchemas } from "fastify-zod";
import { string, z } from "zod";

export const createSessionSchema = z.object({
  email: string({
    required_error: "Email is Required",
  }).email("Invalid Email"),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const createSessionResponseSchema = z.object({
  message: z.string(),
});

export const getUserSessionResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userAgent: z.string(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const { schemas: sessionSchema, $ref } = buildJsonSchemas(
  {
    createSessionResponseSchema,
    createSessionSchema,
    getUserSessionResponseSchema,
  },
  {
    $id: "sessionSchema",
  }
);
