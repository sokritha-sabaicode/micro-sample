import { z } from "zod";

export const TestSchema = z.object({
  fullname: z.string().min(3, "Full name is required"),
});
