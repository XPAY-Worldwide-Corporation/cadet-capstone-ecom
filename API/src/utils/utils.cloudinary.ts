import { v2 as cloudinary } from 'cloudinary';
import { UploadImages } from 'src/types';

export async function multipleImages(
  files: Express.Multer.File[] | undefined,
  oldImagePublicIds: (string | undefined)[],
  cloudinaryFolder: string = 'your_folder_name',
): Promise<UploadImages[]> {
  if (!files || !Array.isArray(files)) return [];

  try {
    for (const publicId of oldImagePublicIds) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            console.error(
              `Failed to delete image with publicId: ${publicId}`,
              error,
            );
          } else {
            console.log(`Deleted image with publicId: ${publicId}`, result);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error while deleting old images:', error);
  }

  const uploadPromises = files.map((file) => {
    return new Promise<UploadImages>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: cloudinaryFolder },
        (error, result) => {
          if (error) {
            console.error(
              `Error while uploading image ${file.originalname}:`,
              error,
            );
            return reject(error);
          }
          if (result) {
            resolve({
              public_id: result.public_id,
              url: result.secure_url.replace(
                /\/([^\/]+)$/,
                `/${file.originalname}`,
              ),
              originalname: file.originalname,
            });
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  });

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error while uploading new images:', error);
    throw error;
  }
}
