import { z } from "zod";

export const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export type TAuthCredentialsValidator = z.infer<
    typeof AuthCredentialsValidator
>