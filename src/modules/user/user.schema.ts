import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be string",
    })
    .email("Invalid Email"),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1),
};

export const userDetailsSchema = {
  id: z.string(),
  email: z.string(),
  profileImage: z.string().optional(),
  name: z.string(),
  createdAt: z.string(),
};

export const profileDetailsSchema = {
  id: z.string().optional(),
  website: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  createdAt: z.string(),
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

const getUserDetailsByIdSchema = z.object({
  userId: z.string().optional(),
});
const getUserDetailsByIdResponseSchema = z.object({
  ...userDetailsSchema,
  profile: z
    .object({
      ...profileDetailsSchema,
    })
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type GetUserDetailsByIdInput = z.infer<typeof getUserDetailsByIdSchema>;

export const { schemas: userSchema, $ref } = buildJsonSchemas(
  {
    createUserDuplicateResponse,
    createUserResponseSchema,
    createUserSchema,
    getUserDetailsByIdSchema,
    getUserDetailsByIdResponseSchema,
  },
  {
    $id: "userSchema",
  }
);
