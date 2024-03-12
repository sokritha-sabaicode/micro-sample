import { z } from "zod";

const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export { UserSchema };
