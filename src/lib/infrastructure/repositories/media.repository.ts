
import cloudinary from "@/lib/config/cloudinary";
import { IMediaRepository } from "@/lib/application/repositories/media.repository.interface";

export class MediaRepository implements IMediaRepository {
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
