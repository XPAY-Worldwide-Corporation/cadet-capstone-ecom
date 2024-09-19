import * as dotenv from "dotenv";
import { RESOURCE } from "src/constants";

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || RESOURCE.DEVELOPMENT,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:!Admin123@localhost:5432/capstone_db?schema=public",
  PORT: process.env.PORT || 4000,
  SALT_NUMBER: Number(process.env.SALT_NUMBER) || 12,
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "your_api_key",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
};
