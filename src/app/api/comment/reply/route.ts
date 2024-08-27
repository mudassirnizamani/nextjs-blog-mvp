import db from "@/lib/db";
import prisma from "@/lib/db";
import { ReplyModel } from "@/models/user_model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { deleteOne, findOne } from "@/utils/mongodbHelpers";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { commentId, replyText } = await req.json();

    if (!commentId || !replyText) {
      return NextResponse.json(
        { success: false, message: "Invalid data sent." },
        { status: 400 }
      );
    }

    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "Please log in first!" },
        { status: 401 }
      );
    }

    const uuid = v4()
    const reply: ReplyModel = {
      commentId: commentId,
      authorId: userID,
      content: replyText,
      id: uuid,
      createdAt: new Date(),
      updatedAt: new Date()
    }

     await db.collection("replies").insertOne(reply);

    return NextResponse.json(
      { success: true, message: "Reply added successfully", reply },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const replyId = req.nextUrl.searchParams.get("id");
    if (!replyId) {
      return NextResponse.json(
        { success: false, message: "Invalid data sent." },
        { status: 400 }
      );
    }

    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "Please log in first!" },
        { status: 401 }
      );
    }

    const existReply = await findOne<ReplyModel>("replies", {
      id: replyId, authorId: userID 
    });

    if (!existReply) {
      return NextResponse.json(
        { success: false, message: "Reply not found!" },
        { status: 404 }
      );
    }

    const replyToDelete = await deleteOne("replies", {
       id: replyId, authorId: userID ,
    });

    return NextResponse.json(
      { success: true, message: "Reply deleted successfully", replyToDelete },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
