import { Access, CollectionConfig } from "payload/types";
import { VerifyEmailHtml } from '../components/emails/verify-email'
import { WelcomeResellerEmailHtml } from "../components/emails/welcome-reseller-email";

const adminsAndUser: Access = ({ req: { user } }) => {
    if (user.role === 'admin') return true

    return {
        id: {
            equals: user.id,
        },
    }
}

export const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: ({ token, user }) => {
                return user.role === 'reseller' ? '' : VerifyEmailHtml({
                    actionLabel: "verify your account",
                    buttonText: "Verify Account",
                    href: `https://skailar.com/verify-email?token=${token}`,
                });
            }
        },
        tokenExpiration: 31536000, // 1 Year
        maxLoginAttempts: 3,
        lockTime: 600 * 1000,
    },
    access: {
        read: adminsAndUser,
        create: () => true,
        update: adminsAndUser,
        delete: adminsAndUser,
    },
    admin: {
        hidden: ({ user }) => user.role !== 'admin',
        defaultColumns: ['username'],
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
        },
        {
            name: 'resellerStore',
            type: 'text',
            required: false,
        },
        {
            name: 'hwidReset',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'hwidResetTime',
            type: 'date',
            required: false,
        },
        {
            name: 'hwidDisableUntil',
            type: 'date',
            required: false
        }
    ],
}