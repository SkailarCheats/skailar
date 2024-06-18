import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { AuthCredentialsValidator, AuthRegisterCredentialsValidator, AuthToggleTwoFactorAuth, AuthUpdateCredentialsValidator, AuthUpdatePasswordValidator } from "../lib/validators/account-credentials-validator";
import { generateOTP, sendOTPByEmail } from "../utils/emailUtils";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
    createPayloadUser: publicProcedure.input(AuthRegisterCredentialsValidator).mutation(async ({ input }) => {
        const { username, email, password, ip, hostname, city, region, country, loc, org, postal, timezone } = input;
        const payload = await getPayloadClient();

        // Check if user exists
        const { docs: users } = await payload.find({
            collection: "users",
            where: {
                email: {
                    equals: email
                }
            }
        });

        if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

        const newUser = await payload.create({
            collection: "users",
            data: {
                username,
                email,
                password,
                role: 'customer',
            }
        });

        if (ip) {
            const userDetails = await payload.create({
                collection: "user_details",
                data: {
                    ip,
                    hostname,
                    city,
                    region,
                    country,
                    loc,
                    org,
                    postal,
                    timezone
                }
            });

            await payload.update({
                collection: "users",
                id: newUser.id,
                data: {
                    details: [userDetails.id]
                }
            });
        }

        return { success: true, sentToEmail: email };
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
        const { email, otp, password, ip, hostname, city, region, country, loc, org, postal, timezone } = input;
        const { res } = ctx;
        const payload = await getPayloadClient();

        try {
            const { user } = await payload.login({
                collection: 'users',
                data: {
                    email,
                    password
                },
                res
            });

            console.log("Logged in user:", user);

            if (!user) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
            }

            // Verifica se l'utente ha attivato il 2FA
            if (user.isTwoFAEnabled) {
                const otp = generateOTP();

                await payload.update({
                    collection: 'users',
                    id: user.id,
                    data: {
                        twoFASecret: otp,
                        twoFAExpires: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Imposta un timeout di 5 minuti per l'OTP
                    }
                });

                await sendOTPByEmail(email, otp);
            }

            if (user.isTwoFAEnabled && (!otp || otp !== user.twoFASecret)) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid OTP' });
            }

            await payload.update({
                collection: 'users',
                id: user.id,
                data: {
                    twoFASecret: null,
                    twoFAExpires: null
                }
            });

            const latestUserDetails = user?.details?.[user.details.length - 1];
            console.log("Latest user details:", latestUserDetails);

            if (latestUserDetails && typeof latestUserDetails !== 'string' && ip !== latestUserDetails.ip) {
                const userDetails = await payload.create({
                    collection: 'user_details',
                    data: {
                        ip,
                        hostname,
                        city,
                        region,
                        country,
                        loc,
                        org,
                        postal,
                        timezone
                    }
                });

                console.log("New user details created:", userDetails);

                if (!Array.isArray(user.details)) {
                    user.details = [];
                }

                if (userDetails?.id) {
                    const updatedDetails = user.details.map(detail =>
                        typeof detail === 'string' ? detail : detail.id
                    );
                    updatedDetails.push(userDetails.id);

                    console.log("Updated details array:", updatedDetails);

                    await payload.update({
                        collection: 'users',
                        id: user.id,
                        data: {
                            details: updatedDetails
                        }
                    });
                    console.log("User details updated successfully.");
                }
            }

            await payload.update({
                collection: 'users',
                id: user.id,
                data: {
                    lastLogin: new Date().toISOString()
                }
            });

            console.log("User last login time updated.");

            return { success: true };
        } catch (error) {
            console.error("Error in sign-in process:", error);
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
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
        const updateFields: { emailChanged?: string; usernameChanged?: string } = {};

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
            updateFields.emailChanged = new Date().toISOString();
        }

        if (newUsername && newUsername !== user.username) {
            updateData.username = newUsername;
            updateFields.usernameChanged = new Date().toISOString();
        }

        await payload.update({
            collection: "users",
            id: id,
            data: {
                ...updateData,
                ...updateFields
            }
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
                passwordChanged: new Date().toISOString(),
            },
        });

        return { success: true };
    }),

    toggleTwoFA: publicProcedure.input(AuthToggleTwoFactorAuth).mutation(async ({ input }) => {
        const { id, status } = input;
        const payload = await getPayloadClient();

        const user = await payload.findByID({
            collection: "users",
            id: id
        });

        if (!user)
            throw new TRPCError({ code: 'NOT_FOUND' })

        if (status !== null) {
            await payload.update({
                collection: "users",
                id: id,
                data: {
                    isTwoFAEnabled: status,
                    twoFAToggled: new Date().toISOString(),
                }
            })
        }

        return { success: true };
    })

})