import { BeforeChangeHook, AfterChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";
import { PRODUCT_CATEGORY } from "../../config";
import { stripe } from "../../lib/stripe";
import { ResellerProduct } from "../../payload-types";

const addUser: BeforeChangeHook<ResellerProduct> = async ({ req, data }) => {
	const user = req.user;

	return { ...data, user: user.id };
};

export const ResellerProducts: CollectionConfig = {
	slug: "reseller_products",
	admin: {
		useAsTitle: "name",
	},
	access: {
		read: ({ req }) => req.user.role === 'admin',
		update: ({ req }) => req.user.role === 'admin',
		delete: ({ req }) => req.user.role === 'admin',
	},
	fields: [
		{
			name: "user",
			type: "relationship",
			relationTo: "users",
			required: true,
			hasMany: false,
			admin: {
				condition: () => false,
			},
		},
		{
			name: "name",
			label: "Name",
			type: "text",
			required: true,
		},
		{
			name: "price",
			label: "Price",
			min: 0,
			max: 1000,
			type: "number",
			required: true,
		},
		{
			name: "category",
			label: "Category",
			type: "select",
			options: PRODUCT_CATEGORY.map(({ label, value }) => ({ label, value })),
			required: true,
		},
		{
			name: 'level',
			label: 'Key Level',
			type: 'text',
			required: false,
		},
		{
			name: 'expiry',
			label: 'Key Expiry in Days',
			type: 'text',
			required: false
		},
		{
			name: "approvedForSale",
			label: "Product Status",
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

export default ResellerProducts;
