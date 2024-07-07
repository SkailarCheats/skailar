import { Access, CollectionConfig } from "payload/types";

const adminsAndUser: Access = ({ req: { user } }) => {
	if (user.role === 'admin') return true

	return {
		id: {
			equals: user.id,
		},
	}
}

export const UserDetails: CollectionConfig = {
	slug: "user_details",
	access: {
		read: adminsAndUser,
		create: () => true,
		update: adminsAndUser,
		delete: adminsAndUser,
	},
	admin: {
		hidden: ({ user }) => user.role !== 'admin',
		defaultColumns: ['ip'],
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
