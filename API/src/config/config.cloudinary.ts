import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'crislhan',
  api_key: '936632453996419',
  api_secret: '1Ie2xM0cNuQhI4WLXJ1RETLNn9g',
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});
