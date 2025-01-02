import { Resend } from 'resend';
import VerificationEmail from "../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { resend } from '@/lib/resend';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Ensure that the email content is being rendered correctly
    const emailContent = VerificationEmail({ username, otp: verifyCode });
    // Send the email using the resend library
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification Code | Verification OTP',
      react: emailContent
    });

    // Log success and return successful response
    console.log(`Verification email successfully sent to ${email}`);
    return { success: true, message: "Verification email successfully sent" };
  } catch (error) {
    // Log error details for debugging
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
