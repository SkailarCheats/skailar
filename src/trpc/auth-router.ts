import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { AuthCredentialsValidator, AuthRegisterCredentialsValidator, AuthUpdateCredentialsValidator, AuthUpdatePasswordValidator } from "../lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
    createPayloadUser: publicProcedure.input(AuthRegisterCredentialsValidator).mutation(async ({ input }) => {
        const { username, email, password } = input
        const payload = await getPayloadClient()

        // Check if user exists
        const { docs: users } = await payload.find({
            collection: "users",
            where: {
                email: {
                    equals: email
                }
            }
        })

        if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" })

        await payload.create({
            collection: "users",
            data: {
                username,
                email,
                password,
                role: 'customer'
            }
        })

        return { success: true, sentToEmail: email }
    }),

    verifyEmail: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
        const { token } = input
        const payload = await getPayloadClient()

        const isVerified = await payload.verifyEmail({
            collection: 'users',
            token
        })

        if (!isVerified) throw new TRPCError({ code: "UNAUTHORIZED" })

        return { success: true }
    }),

    signIn: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input, ctx }) => {
        const { email, password } = input;
        const { res } = ctx
        const payload = await getPayloadClient();

        try {
            await payload.login({
                collection: 'users',
                data: {
                    email,
                    password
                },
                res
            })

            return { success: true }
        } catch (error) {
            throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
    }),

    updateUser: publicProcedure.input(AuthUpdateCredentialsValidator).mutation(async ({ input }) => {
        const { id, newUsername, newEmail } = input;
        const payload = await getPayloadClient();

        const user = await payload.findByID({
            collection: "users",
            id: id,
        });

        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const updateData: { username?: string; email?: string } = {};

        if (newEmail && newEmail !== user.email) {
            const { docs: existingUsersWithEmail } = await payload.find({
                collection: "users",
                where: {
                    email: {
                        equals: newEmail,
                    },
                },
            });

            if (existingUsersWithEmail.length !== 0)
                throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });

            updateData.email = newEmail;
        }

        if (newUsername) {
            updateData.username = newUsername;
        }

        await payload.update({
            collection: "users",
            id: id,
            data: updateData,
        });

        return { success: true, updatedFields: updateData };
    }),

    updatePassword: publicProcedure.input(AuthUpdatePasswordValidator).mutation(async ({ input }) => {
        const { id, newPassword } = input;
        const payload = await getPayloadClient();

        const user = await payload.findByID({
            collection: "users",
            id: id,
        });

        if (!user) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        if (user.password === null)
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Password not Setted' })

        await payload.update({
            collection: "users",
            id: id,
            data: {
                password: newPassword,
            },
        });

        return { success: true };
    }),

})