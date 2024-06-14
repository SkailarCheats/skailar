import { Access, CollectionConfig } from "payload/types";
import { User } from "../payload-types";

export const Reviews: CollectionConfig = {
	slug: "reviews",
	hooks: {
		beforeChange: [({ req, data }) => {
			return { ...data, user: req.user.id }
		}]
	},
	access: {
		create: () => true,
		read: () => true,
		update: () => false,
		delete: ({ req }) => req.user.role === 'admin',
	},
	admin: {
		hidden: ({ user }) => user.role !== "admin"
	},
	fields: [
		{
			name: 'user',
			type: "relationship",
			relationTo: "users",
			required: true,
			hasMany: false,
			admin: {
				condition: () => false
			}
		},
		{
			name: 'rating',
			type: 'number',
			min: 1,
			max: 5,
			required: true,
		},
		{
			name: 'timestamp',
			type: 'date',
			required: true,
		},
		{
			name: 'description',
			type: 'text',
			required: true,
		}
	]
}