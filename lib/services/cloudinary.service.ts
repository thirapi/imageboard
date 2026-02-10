interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

export class CloudinaryService {
  private cloudName: string
  private uploadPreset: string

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""

    if (!this.cloudName || !this.uploadPreset) {
      throw new Error("Cloudinary credentials are not configured")
    }
  }

  async uploadImage(file: File): Promise<UploadResult> {
    // Business rule: Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Allowed: jpg, jpeg, png, webp")
    }

    // Business rule: Validate file size (5MB max)
    const maxSizeMB = 5
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      throw new Error(`File too large. Maximum size is ${maxSizeMB}MB`)
    }

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", this.uploadPreset)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      }
    } catch (error) {
      throw new Error(`Image upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    // Note: Deletion requires server-side API with auth
    // For now, this is a placeholder for future implementation
    console.log(`[Cloudinary] Delete image: ${publicId}`)
  }
}
