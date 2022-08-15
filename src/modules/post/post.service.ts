import { Votes } from "@prisma/client";
import { PostModel, VoteModel } from "../../utils/prisma";
import { CreatePostInput } from "./post.schema";

interface IToggleVoteReturn {
  action: "delete" | "create";
  data: Votes;
}

const selectPostElement = {
  select: {
    _count: {
      select: { comments: true, votes: true },
    },
    votes: {
      where: {
        vote: 1,
      },
      select: {
        id: true,
        vote: true,
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        createdAt: true,
      },
      take: 5, // only take 5 voters to maintain performance for large number of likes
    },
    attachment: true,
    content: true,
    createdAt: true,
    id: true,
    shares: true,
    user: true,
  },
};

const postFormateQuery = (userId: string) => [
  {
    $lookup: {
      from: "User",
      let: { userId: "$userId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$userId"],
            },
          },
        },
        {
          $project: {
            id: {
              $toString: "$_id",
            },
            email: 1,
            profileImage: 1,
            name: 1,
            createdAt: {
              $toString: "$createdAt",
            },
          },
        },
      ],
      as: "user",
    },
  },
  {
    $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "Votes",
      let: { userId: "$userId", postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$userId"] },
                { $eq: ["$postId", "$$postId"] },
              ],
            },
          },
        },
      ],
      as: "isVoted",
    },
  },
  {
    $lookup: {
      from: "Votes",
      let: { userId: "$userId", postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$postId", "$$postId"],
            },
          },
        },
        { $limit: 5 },
        {
          $lookup: {
            from: "User",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$userId"],
                  },
                },
              },
              {
                $project: {
                  id: { $toString: "$_id" },
                  name: 1,
                  profileImage: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
          },
        },
        {
          $project: {
            id: {
              $toString: "$_id",
            },
            vote: 1,
            createdAt: {
              $toString: "$createdAt",
            },
            user: 1,
          },
        },
      ],
      as: "votes",
    },
  },
  {
    $lookup: {
      from: "Votes",
      let: { userId: "$userId", postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$postId", "$$postId"],
            },
          },
        },
        {
          $count: "voteCount",
        },
      ],
      as: "voteCount",
    },
  },
  {
    $unwind: {
      path: "$voteCount",
      preserveNullAndEmptyArrays: true,
    },
  },
  { $sort: { createdAt: -1 } },
  {
    $project: {
      id: {
        $toString: "$_id",
      },
      content: 1,
      shares: 1,
      isVoted: { $gte: [{ $size: "$isVoted" }, 1] },
      createdAt: {
        $toString: "$createdAt",
      },
      attachment: null,
      user: 1,
      votes: 1,
      voteCount: 1,
      _count: {
        votes: {
          $cond: {
            if: "$voteCount.voteCount",
            then: "$voteCount.voteCount",
            else: 0,
          },
        },
        comments: "0",
      },
    },
  },
];

export async function createPost(input: CreatePostInput, userId: string) {
  const post = await PostModel.create({
    data: {
      ...input,
      userId,
    },
    ...selectPostElement,
  });
  return post;
}

export async function getTimelinePost(userId: string) {
  // for now we are only showing post's which are created by user itself on his timeline i.e. on his profile page
  // const timelinePost = PostModel.findMany({
  //   where: {
  //     userId,
  //   },
  //   ...selectPostElement,
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  const timelinePost = PostModel.aggregateRaw({
    pipeline: [
      {
        $match: { userId: { $oid: userId } },
      },
      ...postFormateQuery(userId),
    ],
  });

  return timelinePost;
}
export async function getFeedPost(userId: string) {
  // for now we are showing post of all users
  const feedPost = PostModel.aggregateRaw({
    pipeline: [...postFormateQuery(userId)],
  });
  return feedPost;
}

export async function toggleVote(
  userId: string,
  postId: string
): Promise<IToggleVoteReturn> {
  const voteExisted = await VoteModel.findFirst({
    where: {
      postId,
      userId,
    },
    include: {
      user: true,
    },
  });
  if (voteExisted) {
    await VoteModel.delete({
      where: {
        id: voteExisted.id,
      },
    });
    return {
      action: "delete",
      data: voteExisted,
    };
  }
  const newVote = await VoteModel.create({
    data: {
      postId: postId,
      vote: 1,
      userId: userId,
    },
    include: {
      user: true,
    },
  });
  return {
    action: "create",
    data: newVote,
  };
}
