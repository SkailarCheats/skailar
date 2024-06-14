import { z } from "zod";

export const AuthRegisterCredentialsValidator = z.object({
    username: z.string().min(3, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8)
})

export const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export type TAuthRegisterCredentialsValidator = z.infer<
    typeof AuthRegisterCredentialsValidator
>;

export type TAuthCredentialsValidator = z.infer<
    typeof AuthCredentialsValidator
>