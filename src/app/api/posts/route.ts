import cloudinary from "@/lib/config/cloudinary";
import { PostModel, UserModel } from "@/models/user_model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { count, findOne } from "@/utils/mongodbHelpers";
import { ObjectId } from "mongodb";
import { JsonMetadata, updateJsonFile } from "@/metadata/metadata_parser";

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

    const user = await findOne<UserModel>("users", { id: userID })

    const { title, content, image, type } = await req.json();

    // const makePath = title.split(" ").join("-").toLowerCase();
    // const makePath = title.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").join("-").toLowerCase();
    const makePath = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/[._:]/g, "").split(" ").join("-").toLowerCase();
    let uploadedImage = null;
    // if (image !== null) {
    //   uploadedImage = await cloudinary.uploader.upload(image, {
    //     folder: "blog/articles",
    //   });
    // }


    const id = new ObjectId()
    const newPost: Partial<PostModel> = {
      _id: id,
      title: title,
      image: image !== null ? uploadedImage! : null,
      content: content,
      path: makePath,
      authorId: userID,
      type: type,
      id: id.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection("posts").insertOne(newPost)

    const saveJsonDate: JsonMetadata = {
      [`${user?.username}/${makePath}`]: {
        image: newPost.image ?? "",
        title: newPost.title ?? "",
        description: "This is a post from MeadeaFamily"
      },
    }
    updateJsonFile(saveJsonDate)

    return NextResponse.json(
      { success: true, message: "Post created successfully", newPost, author: user },
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

    // TODO: Write this aggregation better
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
      },
      { $sort: { createdAt: -1 } } // -1 for descending order

    ]).toArray() as PostModel[];

    return NextResponse.json(
      { posts, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
