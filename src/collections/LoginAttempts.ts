import { CollectionConfig } from "payload/types";

export const LoginAttempts: CollectionConfig = {
	slug: "login_attempts",
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
			name: "ip",
			label: "IP Address",
			type: "text",
			required: true,
		},
		{
			name: "datetime",
			label: "Date/Time",
			type: "date",
			required: true,
		},
	],
};
