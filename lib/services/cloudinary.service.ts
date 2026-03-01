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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Allowed: jpg, jpeg, png, webp, gif")
    }

    // Business rule: Validate file size (10MB max as requested)
    const maxSizeMB = 10
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      console.warn(`[CloudinaryService] File size validation failed: ${file.size} chars (max: ${maxSizeBytes})`)
      throw new Error(`File too large. Maximum size is ${maxSizeMB}MB`)
    }

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", this.uploadPreset)

      console.log(`[CloudinaryService] Starting upload for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[CloudinaryService] Upload failed with status ${response.status}:`, errorText)
        throw new Error(`Upload failed with status ${response.status}: ${errorText || "Unknown error"}`)
      }

      const data = await response.json()
      console.log(`[CloudinaryService] Upload successful: ${data.secure_url}`)

      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      }
    } catch (error) {
      console.error(`[CloudinaryService] Unexpected error during upload:`, error)
      throw new Error(`Image upload failed: ${error instanceof Error ? error.message : "Internal Server Error during upload"}`)
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    // Note: Deletion requires server-side API with auth
    // For now, this is a placeholder for future implementation
    console.log(`[Cloudinary] Delete image: ${publicId}`)
  }
}
