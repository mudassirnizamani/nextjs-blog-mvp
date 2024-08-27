import db from "@/lib/db";
import { findMany } from "@/utils/mongodbHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");

    if (query) {
      const queryTags = await findMany("tags", {
        value: { mode: "insensitive" },
      });

      return NextResponse.json(queryTags, { status: 200 });
    } else {
      const tags = await db.collection("tags").find({}).toArray()

      return NextResponse.json(tags, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
