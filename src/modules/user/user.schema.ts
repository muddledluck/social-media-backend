import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be string",
    })
    .email(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1),
};

const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(4),
});

const createUserResponseSchema = z.object({
  id: z.string(),
  ...userCore,
});

const createUserDuplicateResponse = z.object({
  msg: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const { schemas: userSchema, $ref } = buildJsonSchemas({
  createUserDuplicateResponse,
  createUserResponseSchema,
  createUserSchema,
});
