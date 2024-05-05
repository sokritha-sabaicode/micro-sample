import { z } from "zod";

export const UserSaveSchema = z.object({
  authId: z.string(),
  username: z.string(),
  email: z.string().email(),
  profile: z.string().optional(),
  favorites: z.array(z.string()).optional(),
  phoneNumber: z.string().optional()
});


export const UserUpdateSchema = z.object({
  username: z.string(),
  profile: z.string().optional(),
  phoneNumber: z.string().optional()
});