import db from "@/lib/db";
import { PostModel, UserModel } from "@/models/user_model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { findOne } from "@/utils/mongodbHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { filter: string } }
) {
  try {
    const filter = params.filter;

    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "You are not authorize" },
        { status: 401 }
      );
    }

    let results;

    if (filter === "followers") {
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne(
        { id: userID },
        {
          projection: {
            id: 1,
            username: 1,
            name: 1,
            avatar: 1,
            follower: {
              id: 1,
              username: 1,
              name: 1,
              avatar: 1,
              bio: 1,
            },
          },
        }
      );
      results = user
    } else if (filter === "following_users") {

      const user = await findOne<UserModel>("users", { id: userID })
      let postOrder: any = { createdAt: -1 };

      const postsCollection = db.collection('posts');
      let postCondition = {};
      postCondition = {
        type: "PUBLISHED"
      };

      const posts: PostModel[] = await postsCollection.find({ ...postCondition, userId: userID })
        .sort(postOrder)
        .project({ _id: 1, title: 1, type: 1, path: 1, views: 1, createdAt: 1 })
        .toArray() as PostModel[];

      user!.posts = posts;

      results = user
    } else if (filter === "following_tags") {
      results = await findOne<UserModel>("users", {
        id: userID
      });
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
