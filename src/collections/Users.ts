import { CollectionConfig } from "payload/types";
import { VerifyEmailHtml } from '../components/emails/verify-email'

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
        read: () => true,
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
            name: "ip",
            type: 'text',
            required: false,
        },
        {
            name: "hostname",
            type: 'text',
            required: false,
        },
        {
            name: "city",
            type: 'text',
            required: false,
        },
        {
            name: "region",
            type: 'text',
            required: false,
        },
        {
            name: "country",
            type: 'text',
            required: false,
        },
        {
            name: "loc",
            type: 'text',
            required: false,
        },
        {
            name: "org",
            type: 'text',
            required: false,
        },
        {
            name: "postal",
            type: 'text',
            required: false,
        },
        {
            name: "timezone",
            type: 'text',
            required: false,
        },
    ]
}