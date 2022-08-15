import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreatePostInput, TogglePostInput } from "./post.schema";
import {
  createPost,
  getFeedPost,
  getTimelinePost,
  toggleVote,
} from "./post.service";

export async function createPostHandler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreatePostInput;
  }>,
  reply: FastifyReply
) {
  const { body } = request;
  const post = await createPost(body, request.currentUser.id);
  return reply.code(200).send(post);
}

export async function getUsersTimelinePostHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.currentUser.id;
  const timelinePost = await getTimelinePost(userId);
  return reply.code(200).send(timelinePost);
}
export async function getUsersFeedPostHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.currentUser.id;
  const timelinePost = await getFeedPost(userId);
  return reply.code(200).send(timelinePost);
}

export async function toggleVoteHandler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: TogglePostInput;
  }>,
  reply: FastifyReply
) {
  const userId = request.currentUser.id;
  const postId = request.params.postId;
  const result = await toggleVote(userId, postId);
  reply.code(200).send(result);
}
