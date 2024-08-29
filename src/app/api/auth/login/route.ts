import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findOne } from "@/utils/mongodbHelpers";
import { UserModel } from "@/models/user_model";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    const user = await findOne<UserModel>("users", {
      email: email,
    });


    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found!" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, "ledCUDF15fWhhBcP6xcXNbbTaNFGh5VIDQSVnAurNA4iyCMkzIzjI5y2JzFuwNzoUXRCC5tic17KpN8X3RiaCa2TDvHwd6UgpdYmMT9Ff/xZjteKiyeLRIMK9c3L2qqZSzKvB/8yoZgeIZhEV97XMJ19uferzsnyVeNP9F2XLpryK493/9p+zPi2UDN5rqRIdVqn/jwSZHPGM/WRgAnk9o5W/EtomyhIIhfHuhVt4WIRHr5f9VtE6iJXyerA02vrSdY+7D3bn8y4VG+Jct9pR2+to/4mVgydou9/QkUcO/EC3MinuTVh7GAtLNfISP/txxu97d1B8y3HDhOHbg4SPw==", {
      expiresIn: "30 days",
    });

    const options = {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
    response.cookies.set("token", token, options);

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
