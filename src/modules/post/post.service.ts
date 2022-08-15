import { UploadApiOptions } from "cloudinary";
import { Votes } from "@prisma/client";
import { uploadImage } from "../../utils/cloudinary";
import { AttachmentModel, PostModel, VoteModel } from "../../utils/prisma";
import { CreatePostInput } from "./post.schema";

const UploadPostFile = async (file: string, userId: string, postId: string) => {
  const options: UploadApiOptions = {
    public_id: `${userId}/post/${postId}/${Date.now().toString()}`,
    width: 500,
    height: 500,
    crop: "pad",
  };
  const fileData = await uploadImage(file, options);
  if (fileData) {
    await AttachmentModel.create({
      data: {
        type: fileData.resource_type,
        path: fileData.secure_url,
        postId: postId,
      },
    });
  }
};

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
    Attachments: true,
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
      from: "Attachments",
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$postId", "$$postId"],
            },
          },
        },
        {
          $project: {
            id: {
              $toString: "$_id",
            },
            type: 1,
            path: 1,
          },
        },
      ],
      as: "Attachments",
    },
  },
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
      Attachments: 1,
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
  const createdPost = await PostModel.create({
    data: {
      content: input.content,
      userId,
    },
    ...selectPostElement,
  });
  // const attachments = {};
  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const currentFile = input.files[i];
      await UploadPostFile(currentFile, userId, createdPost.id);
    }
  }
  const post = await PostModel.findFirst({
    where: {
      id: createdPost.id,
    },
    ...selectPostElement,
  });
  return { ...post, isVoted: false };
}

export async function getTimelinePost(userId: string) {
  // for now we are only showing post's which are created by user itself on his timeline i.e. on his profile page

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
