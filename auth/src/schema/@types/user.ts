import { UserSignInSchema, UserSignUpSchema } from "../user-schema";

export type UserSignUpSchemaType = ReturnType<typeof UserSignUpSchema.parse>;
export type UserSignInSchemaType = ReturnType<typeof UserSignInSchema.parse>