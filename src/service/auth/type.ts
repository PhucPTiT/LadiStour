import z from "zod";

export const LoginResponseSchema = z.object({
    email: z.email(),
    fullName: z.string(),
    id: z.string(),
    message: z.string(),
    role: z.enum(["ADMIN", "USER"]),
    token: z.string(),
    username: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;