import db from "@/lib/db";
import { CommentModel, PostModel, ReplyModel, UserModel } from "@/models/user_model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { deleteOne, findMany, findOne } from "@/utils/mongodbHelpers";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { content, postID } = await req.json();

    if (!content || !postID) {
      return NextResponse.json(
        { success: false, message: "Something went wrong please try again!" },
        { status: 500 }
      );
    }

    const userID = await getDataFromToken(req);

    const user = await findOne<UserModel>("users", { id: userID });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please try login first!" },
        { status: 401 }
      );
    }

    const post = await findOne<PostModel>("posts", { id: postID });
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found please provide correct postID",
        },
        { status: 500 }
      );
    }

    const id = new ObjectId()
    const comment: CommentModel = {
      _id: id, postId: postID, content: content, authorId: userID, id: id.toString(), createdAt: new Date(), updatedAt: new Date()
    }

    await db.collection("comments").insertOne(comment)

    return NextResponse.json(
      { success: true, message: "Comment added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Invalid data send!" },
        { status: 400 }
      );
    }

    const comments = await findMany("comments", {
      postId: postId
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE COMMENT WITH ALL REPLIES
export async function DELETE(req: NextRequest) {
  try {
    const commentId = req.nextUrl.searchParams.get("id");

    if (!commentId) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid comment Id" },
        { status: 500 }
      );
    }

    const userID = await getDataFromToken(req);

    // Check if the comment exists and if it belongs to the user
    const existingComment = await findOne<CommentModel>("comments", {
      id: commentId, authorId: userID
    });

    if (!existingComment) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment not found or doesn't belong to the user",
        },
        { status: 404 } // Not Found
      );
    }

    // Find and delete all associated replies
    const repliesToDelete = await findMany<ReplyModel>("replies", {
      commentId: commentId,
    });

    // Delete the associated replies
    for (const reply of repliesToDelete) {
      await deleteOne("replies", { id: reply.id });
    }

    await deleteOne("comments", { id: commentId, authorId: userID });

    return NextResponse.json(
      { success: true, message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
