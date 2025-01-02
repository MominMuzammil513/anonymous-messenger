import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export const GET = async (request: Request) => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const sessionUser: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user status to accept message",
      },
      { status: 400 }
    );
  }

  const userId = new mongoose.Types.ObjectId(sessionUser._id);

  try {
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$message' },
      { $sort: { 'message.createAt': -1 } },
      { $group: { _id: '$_id', message: { $push: '$message' } } }
    ]);

    if (!userMessages || userMessages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: userMessages[0].message,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user status to accept message",
      },
      { status: 500 }
    );
  }
};
