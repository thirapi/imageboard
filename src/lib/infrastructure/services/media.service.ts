
import cloudinary from "@/lib/config/cloudinary";
import { IMediaService } from "@/lib/application/services/media.service.interface";

export class MediaService implements IMediaService {
  async upload(file: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "next-clean-arch-forum", // Optional: you can organize uploads in folders
          public_id: fileName,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            return resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(file);
    });
  }
}
