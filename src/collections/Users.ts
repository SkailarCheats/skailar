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
        }
    ]
}