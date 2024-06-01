import { CollectionConfig } from "payload/types";

export const Warehouse: CollectionConfig = {
  slug: "warehouse",
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => user.role !== 'admin'
  },
  access: {
    read: ({ req }) => req.user.role === 'admin',
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
  },
  fields: [
    {
      name: "name",
      label: "Warehouse Name",
      type: "text",
      required: true,
    },
    {
      name: "stock",
      label: "Stock (License Keys)",
      type: "textarea",
      required: false,
      admin: {
        description: "Enter license keys, each separated by a new line.",
      },
      maxLength: 99999999999999
    },
    {
      name: "product",
      label: "Product",
      type: "relationship",
      relationTo: "products",
      hasMany: false,
      required: true,
    },
  ],
};

export default Warehouse;
