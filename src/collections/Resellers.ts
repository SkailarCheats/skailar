import { CollectionConfig } from "payload/types";

export const Resellers: CollectionConfig = {
	slug: "resellers",
	hooks: {
		beforeChange: [({ req, data }) => {
			return { ...data, user: req.user.id }
		}]
	},
	access: {
		create: ({ req }) => req.user.role === 'admin',
		read: () => true,
		update: ({ req }) => req.user.role === 'admin',
		delete: ({ req }) => req.user.role === 'admin',
	},
	admin: {
		hidden: ({ user }) => user.role !== "admin"
	},
	fields: [
		{
			name: 'logo',
			type: 'text',
			required: true,
		},
		{
			name: 'name',
			type: 'text',
			required: true,
		},
		{
			name: 'discord',
			type: 'text',
			required: false,
		},
		{
			name: 'telegram',
			type: 'text',
			required: false,
		},
		{
			name: 'website',
			type: 'text',
			required: true,
		},
		{
			name: "username",
			type: 'text',
			required: true
		},
		{
			name: 'payments',
			type: 'array',
			label: 'Payment Methods',
			labels: {
				singular: 'Payment Method',
				plural: 'Payment Methods',
			},
			fields: [
				{
					name: 'method',
					type: 'text',
					required: true,
				},
				{
					name: 'icon',
					type: 'text',
					required: true
				},
				{
					name: 'color',
					type: 'text',
					required: true,
				}
			]
		}
	]
}