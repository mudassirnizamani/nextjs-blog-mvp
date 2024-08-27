import cloudinary from "@/lib/config/cloudinary";
import { PostModel } from "@/models/user_model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { count, findMany } from "@/utils/mongodbHelpers";

//@description     Create a new post
//@route           POST /api/posts
//@access          protected
export async function POST(req: NextRequest) {
  try {
    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "Please login first!" },
        { status: 401 }
      );
    }

    const { title, content, image, type } = await req.json();

    const makePath = title.split(" ").join("-").toLowerCase();

    let uploadedImage = null;
    if (image !== null) {
      uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "blog/articles",
      });
    }

    const uuid = uuidv4()
    const newPost: Partial<PostModel> = {
      title: title,
      image: image !== null ? uploadedImage.secure_url : null,
      content: content,
      path: makePath,
      authorId: userID,
      type: type,
      id: uuid,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection("posts").insertOne(newPost)

    return NextResponse.json(
      { success: true, message: "Post created successfully", newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//@description     Get all post for home feed
//@route           GET /api/posts
//@access          Not protected
export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

    // const skip = (page - 1) * limit;

    const totalPostsCount = await count("posts", {
      type: "PUBLISHED"
    });

    const totalPages = Math.ceil(totalPostsCount / limit);

    const posts = await findMany("posts", {
      type: "PUBLISHED"
    });

    return NextResponse.json(
      { posts, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
