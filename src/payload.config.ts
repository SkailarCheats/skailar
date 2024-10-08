import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import dotenv from "dotenv";
import path from "path";
import { buildConfig } from "payload/config";
import { Media } from "./collections/Media";
import { Newsletter } from "./collections/Newsletter";
import { Orders } from "./collections/Orders";
import { ProductFile } from "./collections/ProductFile";
import { Products } from "./collections/Products/Products";
import ResellerProducts from "./collections/Products/ResellerProducts";
import { Resellers } from "./collections/Resellers";
import { Reviews } from "./collections/Reviews";
import { UserDetails } from "./collections/UserDetails";
import { Users } from "./collections/Users";
import { BanRequest } from "./collections/Licenses/BanRequest";

dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [Users, Products, Media, ProductFile, Orders, Reviews, UserDetails, Resellers, Newsletter, ResellerProducts, BanRequest],
    routes: {
        admin: '/sell'
    },
    admin: {
        user: "users",
        bundler: webpackBundler(),
        meta: {
            titleSuffix: "- Skailar",
            favicon: 'https://cdn.skailar.com/favicon.ico',
            ogImage: 'https://cdn.skailar.com/v1/assets/img/thumbnail.png'
        },
    },
    rateLimit: {
        max: 1500,
    },
    editor: slateEditor({}),
    db: mongooseAdapter({ url: process.env.MONGODB_URL! }),
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    }
})