import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const HASH_SALT_ROUNDS = parseInt(process.env.HASH_SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;

export {DATABASE_URL, HASH_SALT_ROUNDS, JWT_SECRET}

