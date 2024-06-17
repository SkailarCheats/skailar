import { CollectionConfig } from "payload/types";

export const UserDetails: CollectionConfig = {
	slug: "user_details",
	access: {
		read: () => true,
		create: () => true,
	},
	fields: [
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
		}
	],
};
