import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long." })
  .max(20, { message: "Username must be at most 20 characters long." })
  // .regex(/^[a-zA-Z0-9]+$/, {
  //   message: "Username must not contain special characters",
  // });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .email({ message: "invalid email address" })
    .regex(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "invalid email address"
    ),
    password: z.string().min(8,{message:"password must be at least 8 characters"})
});
