import db from "@/lib/db";
import { UserModel } from "@/models/user_model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { findOne } from "@/utils/mongodbHelpers";
import { NextRequest, NextResponse } from "next/server";

//@description     access the dashboard for login user
//@route           GET /api/dashboard
//@access          protected
export async function GET(req: NextRequest) {
  try {
    const postFilter = req.nextUrl.searchParams.get("filter");

    let result: any = {}
    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "You are not authorize" },
        { status: 401 }
      );
    }

    const postsCollection = db.collection('posts');

    const user = await findOne<UserModel>("users", { id: userID })

    let postOrder: any = { createdAt: -1 };
    if (postFilter === 'most_views') {
      postOrder = { views: -1 };
    }

    let postCondition = {};
    if (postFilter === 'DRAFT' || postFilter === 'PUBLISHED') {
      postCondition = { type: postFilter };
    }

    // const posts: PostModel[] = await postsCollection.find<PostModel>({ ...postCondition, userId: userID })
    //   .sort(postOrder)
    //   .project({ _id: 1, title: 1, type: 1, path: 1, views: 1, createdAt: 1 })
    //   .toArray() as PostModel[]

    const posts: any[] = await postsCollection.aggregate([
      { $match: { ...postCondition, authorId: userID } },
      { $sort: postOrder },
      { $project: { _id: 1, title: 1, type: 1, path: 1, views: 1, createdAt: 1, authorId: 1 } },
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
    ]).toArray() as any[];

    user!.posts = posts;

    result = {
      ...result,
      ...user,
      _count: {
        comment: 0,
        replies: 0
      }
    }
    if (!user) {
      return NextResponse.json(
        { success: false, message: "You are not authorize plz log in first" },
        { status: 401 }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
