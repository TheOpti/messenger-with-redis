import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be 20 characters or less" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be 20 characters or less" }),
});

export const signupSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be 20 characters or less" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(20, { message: "Password must be 20 characters or less" }),
    passwordRepeated: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(20, { message: "Password must be 20 characters or less" }),
  })
  .refine((data) => data.password === data.passwordRepeated, {
    message: "Passwords don't match",
    path: ["passwordRepeated"],
  });
