import { CollectionConfig } from "payload/types";

export const BanRequest: CollectionConfig = {
	slug: "banrequest",
	access: {
		read: () => true,
		create: () => true,
	},
	fields: [
		{
			name: "username",
			label: "User",
			type: "relationship",
			relationTo: "users",
			required: true,
		},
		{
			name: "key",
			label: "Key",
			type: "text",
			required: true,
		},
		{
			name: "reason",
			label: "Reason",
			type: "text",
			required: true,
		},
		{
			name: "status",
			label: "Request Status",
			type: "select",
			defaultValue: "pending",
			access: {
				create: ({ req }) => req.user.role === "admin",
				read: ({ req }) => req.user.role === "admin",
				update: ({ req }) => req.user.role === "admin",
			},
			options: [
				{
					label: "Pending Verification",
					value: "pending",
				},
				{
					label: "Approved",
					value: "approved",
				},
				{
					label: "Denied",
					value: "denied",
				},
			],
		},
	],
};
