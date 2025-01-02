import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exist",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return NextResponse.json(
            {
              success: false,
              message: "Email already exist",
            },
            { status: 400 }
          );
      }else{
        // await UserModel.updateOne({ email }, { $set: { verifyCode } });
        const hashedPassword = await bcrypt.hashSync(password,10)
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
      }
    }else{
        const hashedPassword = await bcrypt.hash(password,10)
        const expiryDate = new Date(Date.now() + 5 * 60 * 1000)
        const newUser = new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpire:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            message:[]
        })
        await newUser.save()
    }
    //send verification email
    const emailResponse = await sendVerificationEmail(email,username,verifyCode)
    console.log(emailResponse);
    if(!emailResponse.success){
        return NextResponse.json(
            {
                success:false,
                message:emailResponse.message,
                },
                { status: 400 }
                );
    }
    return NextResponse.json(
        {
            success:true,
            message:"User registered successfully. Please verify your email"
            },
            { status: 200 }
            );
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
