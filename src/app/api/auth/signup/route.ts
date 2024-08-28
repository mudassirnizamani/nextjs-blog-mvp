import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { findOne } from "@/utils/mongodbHelpers";
import db from "@/lib/db";
import { UserModel } from "@/models/user_model";
import { ObjectId } from "mongodb";


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const bodyData = await req.json();
    const { name, username, email, password } = bodyData;

    const existingUser = await findOne("users", {
      email: email,
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exist!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const id = new ObjectId();
    const newUser: UserModel = {
      _id: id,
      password: hashedPassword,
      name: name,
      username: username,
      email: email,
      id: id.toString(),
      createdAt: new Date(),
      bio: "",
      site: "",
      updatedAt: new Date(),
    }

    await db.collection("users").insertOne(newUser);

    const tokenData = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "30 days",
    });

    const options = {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
      },
      { status: 200 }
    );
    response.cookies.set("token", token, options);

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
