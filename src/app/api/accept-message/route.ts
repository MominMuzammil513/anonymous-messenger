import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; //issue of the user
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "not authenticated" },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "failed user status to accept message" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "failed to updated user status to accept message",
      },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) => {
    await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; //issue of the user
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "user not authenticated" },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return NextResponse.json({ success: false, message: "User not found or authenticated"}, { status:400})
    }
    return NextResponse.json({ success: true, message:"User found",isAcceptingMessage:foundUser.isAcceptingMessage}, { status:200});
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error is getting message acceptance status "
      },
      { status: 500 }
    )
  }
};
