import dbConnect from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import { NextResponse } from "next/server"
import UserModel from "@/model/User"


export const DELETE =async(request: Request,{params}:{params:{messageId:string}})=>{
  const userMessageId = params.messageId
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return NextResponse.json(
            {
              success: false,
              message: "Not authenticated",
            },
            { status: 400 }
          )
    }
    try {
      const updatedResult = await UserModel.updateOne(
        {_id:user._id},
        {$pull:{message:{_id:userMessageId}}}
      )
      if(updatedResult.modifiedCount === 0){
        return NextResponse.json(
          {
            success: false,
            message: "Message not found or already Deleted",
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        {
          success: true,
          message: "Message Deleted",
        },
        { status: 200 }
      )
    } catch (error) {
      console.log("Error is deleting message router", error);
      return NextResponse.json(
        {
          success: false,
          message: "something went wrong. please try again and check your network.",
        },
        { status: 500 }
      )
    }
   
}