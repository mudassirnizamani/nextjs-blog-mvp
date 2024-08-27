import { PostModel } from "@/models/user_model";
import {
  // FILTER_COMMENTS,
  // FILTER_MY_POSTS_ONLY,
  // FILTER_PEOPLE,
  FILTER_POSTS,
  // FILTER_TAGS,
} from "@/utils/constants";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { findMany } from "@/utils/mongodbHelpers";
import { NextRequest, NextResponse } from "next/server";

//@description     Get results for search queries
//@route           GET /api/search?q=query&filter=filter
//@access          Not protected
export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    const filter = req.nextUrl.searchParams.get("filter");

    if (!query) {
      let posts = await findMany<PostModel>("posts", {
        type: "PUBLISHED",
      });

      posts = posts.filter(({ title }: PostModel) => title.includes(query ?? ""))
      return NextResponse.json(posts, { status: 200 });
    }

    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "You are not authorize" },
        { status: 401 }
      );
    }

    let data: any = [];

    switch (filter) {
      case FILTER_POSTS:
        let postsData = await findMany<PostModel>("posts", {
          type: "PUBLISHED",
        });

        postsData = postsData.filter(({ title }: PostModel) => title.includes(query))
        data = postsData;
        break;
      // case FILTER_PEOPLE:
      //   const peopleData = await findMany({
      //     where: {
      //       OR: [
      //         { name: { contains: query, mode: "insensitive" } },
      //         { username: { contains: query, mode: "insensitive" } },
      //       ],
      //     },
      //     select: {
      //       id: true,
      //       name: true,
      //       username: true,
      //       avatar: true,
      //     },
      //   });
      //
      //   data = peopleData;
      //   break;
      // case FILTER_COMMENTS:
      //   const commentsData = await prisma.comment.findMany({
      //     where: {
      //       content: { contains: query, mode: "insensitive" },
      //       NOT: [{ post: { type: "DRAFT" } }],
      //     },
      //     select: {
      //       id: true,
      //       post: {
      //         include: {
      //           author: {
      //             select: {
      //               id: true,
      //               name: true,
      //               username: true,
      //               avatar: true,
      //             },
      //           },
      //           saved: true,
      //           _count: { select: { comments: true } },
      //         },
      //       },
      //     },
      //   });
      //   data = commentsData;
      //   break;
      // case FILTER_TAGS:
      //   const tagsData = await prisma.tag.findMany({
      //     where: { value: { contains: query, mode: "insensitive" } },
      //   });
      //   data = tagsData;
      //   break;
      // case FILTER_MY_POSTS_ONLY:
      //   const myPostsData = await prisma.post.findMany({
      //     where: {
      //       AND: [
      //         { authorId: userID },
      //         { title: { contains: query, mode: "insensitive" } },
      //       ],
      //     },
      //     include: {
      //       author: {
      //         select: {
      //           id: true,
      //           name: true,
      //           username: true,
      //           avatar: true,
      //         },
      //       },
      //       saved: true,
      //       _count: { select: { comments: true } },
      //     },
      //   });
      //   data = myPostsData;
      //   break;
      default:
        let defaultPosts = await findMany<PostModel>("posts", {
          type: "PUBLISHED",
        });

        postsData = defaultPosts.filter(({ title }: PostModel) => title.includes(query))
        data = postsData;

        break;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
