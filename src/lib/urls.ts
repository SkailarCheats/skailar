require('dotenv').config();

const sellerKey = process.env.NEXT_PUBLIC_SKAILAR_SELLER_KEY;

export const getSellerBaseURL = `https://api.skailar.com/api/seller/?sellerkey=${sellerKey}`;
