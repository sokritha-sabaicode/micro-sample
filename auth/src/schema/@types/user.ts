import { z } from "zod";
import { UserSignUpSchema } from "../user-schema";

export type UserSignUpSchemaType = ReturnType<typeof UserSignUpSchema.parse>;
