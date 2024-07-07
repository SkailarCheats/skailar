import { Access, CollectionConfig } from "payload/types";

const adminsAndUser: Access = ({ req: { user } }) => {
	if (user.role === 'admin') return true

	return {
		id: {
			equals: user.id,
		},
	}
}

export const Newsletter: CollectionConfig = {
	slug: "newsletters",
	access: {
		read: adminsAndUser,
		create: () => true,
		update: adminsAndUser,
		delete: adminsAndUser,
	},
	admin: {
		hidden: ({ user }) => user.role !== 'admin',
		defaultColumns: ['email'],
	},
	fields: [
		{
			name: 'email',
			type: 'email',
			required: true,
			unique: true
		},
		{
			name: 'username',
			type: 'text',
			required: false,
		},
		{
			name: 'deleted',
			type: 'checkbox',
			defaultValue: false
		}
	],
};
