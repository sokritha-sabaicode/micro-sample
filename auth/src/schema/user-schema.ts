import { z } from "zod";

export const UserSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fullname: z.string().min(1, "Full name is required"),
});
