import { deleteFileFromCloudinary } from "@/utils/deleteFileFromCloudinary";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { getPublicIdCloudinary } from "@/utils/getPublicIdCloudinary";
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { deleteOne, findMany, findOne, updateOne } from "@/utils/mongodbHelpers";
import { CommentModel, PostModel, ReplyModel } from "@/models/user_model";
import db from "@/lib/db";

//@description     Get a single post
//@route           GET /api/posts/[post.path]
//@access          Not protected
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {

    // TODO: Write this aggregate queries better
    const cursor = db.collection("posts").aggregate([
      { $match: { path: params.postId } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: 'id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      }
    ]);


    const post = (await cursor.next()) as PostModel | null;

    const posts: PostModel[] = await db.collection("posts").aggregate([
      { $match: { type: "PUBLISHED" } },
      // { $sort: postOrder },
      // { $project: { _id: 1, title: 1, type: 1, path: 1, views: 1, createdAt: 1, authorId: 1 } },
      {
        $lookup: {
          from: 'users', // replace with your users collection name
          localField: 'authorId',
          foreignField: 'id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      }
    ]).toArray() as PostModel[];

    if (post) {
      await updateOne("posts", { id: post.id },
        { views: post.views + 1 });
    } else {
      return NextResponse.json(
        { success: false, message: "Post not found!" },
        { status: 404 }
      );
    }

    const ret: Object = { post: post, authorPosts: posts }

    return NextResponse.json(ret, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

//@description     Update a single post
//@route           PATCH /api/posts/[post.path]
//@access          protected
export async function PATCH(req: NextRequest) {
  try {
    const { title, content, image, userId, postId, type } = await req.json();

    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "You are not authorize!" },
        { status: 401 }
      );
    }

    if (userID !== userId) {
      return NextResponse.json(
        { success: false, message: "UserId not match" },
        { status: 404 }
      );
    }

    const post = await findOne<PostModel>("posts", { id: postId });
    if (!post || !postId) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID!" },
        { status: 404 }
      );
    }

    const updatedData: any = {};

    if (title !== post.title) {
      updatedData.title = title;
    }

    if (content !== post.content) {
      updatedData.content = content;
    }

    if (image !== post.image) {
      if (post.image) {
        const publicId = getPublicIdCloudinary(post.image);
        await deleteFileFromCloudinary(publicId!, "articles");
      }

      if (image === null) {
        updatedData.image = null;
      } else {
        const newImage = await uploadImageToCloudinary(image, "blog/articles");
        updatedData.image = newImage.secure_url;
      }
    }

    if (type !== post.type) {
      updatedData.type = type;
    }

    if (Object.keys(updatedData).length > 0) {
      await updateOne("posts",
        { id: post.id },
        updatedData,
      );
    }

    return NextResponse.json(
      { success: true, message: "Your post has updated successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

//@description     Delete a single post
//@route           DELETE /api/posts/[post.path]
//@access          protected
export async function DELETE(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get("id");
    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID!" },
        { status: 404 }
      );
    }

    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "You are not authorize!" },
        { status: 401 }
      );
    }

    const post = await findOne<PostModel>("posts", {
      id: postId, authorId: userID,
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found!" },
        { status: 404 }
      );
    }

    if (post.image) {
      const publicID = getPublicIdCloudinary(post.image);
      await deleteFileFromCloudinary(publicID!, "articles");
    }

    const deleteToComment = await findMany<CommentModel>("comments",
      { postId: post.id },
    );

    // Delete all comments and there replies associated with the post
    for (const deleteId of deleteToComment) {
      const repliesToDelete = await findMany<ReplyModel>("replies", {
        commentId: deleteId.id
      });
      for (const deleteReply of repliesToDelete) {
        await deleteOne("replies",
          { id: deleteReply.id },
        );
      }

      await deleteOne("comments", {
        id: deleteId.id
      });
    }

    await deleteOne("posts", {
      d: post.id, authorId: userID
    });

    return NextResponse.json(
      { success: true, message: "Your post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
