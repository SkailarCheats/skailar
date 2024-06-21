import { Access, CollectionConfig } from "payload/types";
import { VerifyEmailHtml } from '../components/emails/verify-email'
import { User } from "@/payload-types";

const isAdminOrHasAccessToUsers = (): Access => async ({
    req
}) => {
    const user = req.user as User | undefined

    if (!user) return false;
    if (user.role === "admin") return true;

    return {
        user: {
            equals: req.user.id
        }
    }
}

export const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: ({ token }) => {
                return VerifyEmailHtml({
                    actionLabel: "verify your account",
                    buttonText: "Verify Account",
                    href: `https://skailar.com/verify-email?token=${token}`
                })
            }
        }
    },
    access: {
        read: ({ req }) => {
            return isAdminOrHasAccessToUsers()({ req })
        },
        create: () => true,
    },
    fields: [
        {
            name: 'username',
            required: true,
            type: 'text',
            unique: true,
        },
        {
            name: "role",
            defaultValue: 'customer',
            required: true,
            admin: {
                condition: () => false
            },
            type: "select",
            options: [
                { label: "Admin", value: 'admin' },
                { label: "Reseller", value: 'reseller' },
                { label: "Customer", value: 'customer' },
            ]
        },
        {
            name: 'lastLogin',
            type: 'date',
            admin: {
                readOnly: true,
                position: 'sidebar',
            },
        },
        {
            name: 'passwordChanged',
            type: 'date',
            admin: {
                readOnly: true,
                position: 'sidebar'
            },
        },
        {
            name: 'usernameChanged',
            type: 'date',
            admin: {
                readOnly: true,
                position: 'sidebar'
            },
        },
        {
            name: 'emailChanged',
            type: 'date',
            admin: {
                readOnly: true,
                position: 'sidebar'
            },
        },
        {
            name: "twoFASecret",
            type: 'text',
            required: false,
            admin: {
                readOnly: true,
            }
        },
        {
            name: "twoFAExpires",
            type: 'date',
            required: false
        },
        {
            name: "isTwoFAEnabled",
            type: "checkbox",
            defaultValue: false,
            admin: {
                readOnly: true,
            }
        },
        {
            name: "twoFAToggled",
            type: 'date',
            admin: {
                readOnly: true,
            }
        },
        {
            name: 'details',
            type: 'relationship',
            relationTo: 'user_details',
            hasMany: true,
        }
    ],
}