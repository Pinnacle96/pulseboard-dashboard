import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.string().trim().min(2, "Role must be at least 2 characters"),
  location: z.string().trim().min(2, "Location must be at least 2 characters"),
  company: z.string().trim().min(2, "Company must be at least 2 characters")
});

export type ProfileValues = z.infer<typeof profileSchema>;
