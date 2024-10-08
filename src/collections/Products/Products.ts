import { BeforeChangeHook, AfterChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";
import { PRODUCT_CATEGORY } from "../../config";
import { stripe } from "../../lib/stripe";
import { Product } from "../../payload-types";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
    const user = req.user;

    return { ...data, user: user.id };
};

export const Products: CollectionConfig = {
    slug: "products",
    admin: {
        useAsTitle: "name",
    },
    access: {
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
    },
    hooks: {
        beforeChange: [
            addUser,
            async (args) => {
                if (args.operation === "create") {
                    const data = args.data as Product;

                    const createdProduct = await stripe.products.create({
                        name: data.name,
                        default_price_data: {
                            currency: "EUR",
                            unit_amount: Math.round(data.price * 100),
                        },
                    });

                    const updated: Product = {
                        ...data,
                        stripeId: createdProduct.id,
                        priceId: createdProduct.default_price as string,
                    };

                    return updated;
                } else if (args.operation === "update") {
                    const data = args.data as Product;

                    const updatedProduct = await stripe.products.update(data.stripeId!, {
                        name: data.name,
                        default_price: data.priceId!,
                    });

                    const updated: Product = {
                        ...data,
                        stripeId: updatedProduct.id,
                        priceId: updatedProduct.default_price as string,
                    };

                    return updated;
                }
            },
        ],
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
            name: "description",
            label: "Description",
            type: "richText",
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
            name: "product_files",
            label: "Product File",
            type: "relationship",
            required: true,
            relationTo: "product_file",
            hasMany: false,
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
        {
            name: "priceId",
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: "text",
            admin: {
                hidden: true,
            },
        },
        {
            name: "stripeId",
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: "text",
            admin: {
                hidden: true,
            },
        },
        {
            name: "images",
            type: "array",
            label: "Product Images",
            minRows: 1,
            maxRows: 4,
            required: true,
            labels: {
                singular: "Image",
                plural: "Images",
            },
            fields: [
                {
                    name: "image",
                    type: "text",
                    required: true,
                },
            ],
        },
    ],
};

export default Products;
