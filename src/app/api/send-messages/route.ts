import dbConnect from "@/lib/dbConnect"
import UserModel, { Message } from "@/model/User"
import { NextResponse } from "next/server"


export const POST =async(request:Request) =>{
    await dbConnect()
    const {username,content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return NextResponse.json(
                {
                  success: false,
                  message: "User not found -------",
                },
                { status: 400 }
              )
        }
        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                {
                  success: false,
                  message: "user is not accepting message",
                },
                { status: 403 }
              )
        }
        const newMessage = {content,createAt: new Date()}
        user.message.push(newMessage as Message)
        await user.save()
        return NextResponse.json(
            {
              success: true,
              message: "Message send successfully",
              
            },
            { status: 200 }
          )
    } catch (error) {
        return NextResponse.json(
            {
              success: false,
              message: "Internal Server Error, please try again",
            },
            { status: 500 }
          )
    }
}