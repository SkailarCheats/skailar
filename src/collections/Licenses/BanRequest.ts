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
		}
	],
};
