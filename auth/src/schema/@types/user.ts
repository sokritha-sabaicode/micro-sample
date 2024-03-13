import { z } from "zod";
import { UserSignUpSchema } from "../user-schema";

export type UserSignUpSchemaType = z.infer<typeof UserSignUpSchema>;
