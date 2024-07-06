import { z } from "zod";

export const AuthRegisterCredentialsValidator = z.object({
    username: z.string().min(3, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8),
    ip: z.string().optional(),
    hostname: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    loc: z.string().optional(),
    org: z.string().optional(),
    postal: z.string().optional(),
    timezone: z.string().optional(),
    website: z.string().url('Invalid URL').optional(),
})

export const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    ip: z.string().optional(),
    hostname: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    loc: z.string().optional(),
    org: z.string().optional(),
    postal: z.string().optional(),
    timezone: z.string().optional(),
    otp: z.string().min(6).max(6).optional()
})

export const AuthUpdateCredentialsValidator = z.object({
    id: z.string(),
    newUsername: z.string().optional(),
    newEmail: z.string().email().optional(),
});

export const AuthUpdatePasswordValidator = z.object({
    id: z.string(),
    newPassword: z.string().min(8),
})

export const AuthToggleTwoFactorAuth = z.object({
    id: z.string(),
    status: z.boolean()
});

export type TAuthRegisterCredentialsValidator = z.infer<
    typeof AuthRegisterCredentialsValidator
>;

export type TAuthCredentialsValidator = z.infer<
    typeof AuthCredentialsValidator
>

export type TAuthUpdateCredentialsValidator = z.infer<
    typeof AuthUpdateCredentialsValidator
>

export type TAuthUpdatePasswordValidator = z.infer<
    typeof AuthUpdatePasswordValidator
>

export type TAuthToggleTwoFactorAuth = z.infer<
    typeof AuthToggleTwoFactorAuth
>