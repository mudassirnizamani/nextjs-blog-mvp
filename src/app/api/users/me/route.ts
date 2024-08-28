import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "@/utils/getDataFromToken";
import { deleteFileFromCloudinary } from "@/utils/deleteFileFromCloudinary";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { getPublicIdCloudinary } from "@/utils/getPublicIdCloudinary";
import { findOne, updateOne } from "@/utils/mongodbHelpers";
import { UserModel } from "@/models/user_model";

//@description     Get the current user
//@route           GET /api/users/me
//@access          protected
export async function GET(req: NextRequest) {
  try {
    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "You are not authorize" },
        { status: 401 }
      );
    }

    const user = await findOne<UserModel>("users", { id: userID })

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//@description     Update current user profile
//@route           PUT /api/users/me
//@access          protected
export async function PUT(req: NextRequest) {
  try {
    const { name, username, email, bio, site, file } = await req.json();

    const userID = await getDataFromToken(req);
    if (!userID) {
      return NextResponse.json(
        { success: false, message: "You are not authorize" },
        { status: 401 }
      );
    }

    const user = await findOne<UserModel>("users", { id: userID })
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updatedData: any = {};

    if (name !== user.name) {
      updatedData.name = name;
    }
    if (username !== user.username) {
      updatedData.username = username;
    }
    if (bio !== user.bio) {
      updatedData.bio = bio;
    }
    if (site !== user.site) {
      updatedData.site = site;
    }
    if (email !== user.email) {
      updatedData.email = email;
    }

    if (file) {
      const uploadedImage = await uploadImageToCloudinary(
        file,
        "blog/profiles"
      );

      if (user.avatar && !user.avatar.includes("default/profile.jpg")) {
        const publicId = getPublicIdCloudinary(user.avatar);
        await deleteFileFromCloudinary(publicId!, "profiles");
      }

      updatedData.avatar = uploadedImage.secure_url;
    }

    if (Object.keys(updatedData).length > 0) {
      await updateOne("users", {
        id: user.id
      }, updatedData);
    }

    return NextResponse.json(
      { success: true, message: "Your profile has been updated" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
