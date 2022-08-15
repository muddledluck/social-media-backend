import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { userDetailsSchema } from "../user/user.schema";

const voteObject = {
  id: z.string(),
  vote: z.number(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    profileImage: z.string().optional(),
  }),
};

export const createPostSchema = z.object({
  content: z.string().min(1),
  attachments: z.string().array().optional(),
});

export const toggleVoteSchema = z.object({
  postId: z.string(),
});

export const toggleVoteResponseSchema = z.object({
  action: z.string(),
  data: z.object({
    ...voteObject,
  }),
});

export const postResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  shares: z.string(),
  Attachments: z
    .object({
      id: z.string(),
      type: z.string(),
      path: z.string(),
    })
    .array(),
  createdAt: z.string(),
  user: z.object({ ...userDetailsSchema }),
  isVoted: z.boolean(),
  votes: z
    .object({
      ...voteObject,
    })
    .array(),
  _count: z.object({
    comments: z.number(),
    votes: z.number(),
  }),
});

export const arrayPostResponseSchema = postResponseSchema.array();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type TogglePostInput = z.infer<typeof toggleVoteSchema>;

export const { schemas: postSchema, $ref } = buildJsonSchemas(
  {
    postResponseSchema,
    toggleVoteSchema,
    createPostSchema,
    arrayPostResponseSchema,
    toggleVoteResponseSchema,
  },
  {
    $id: "postSchema",
  }
);
