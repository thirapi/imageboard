
export interface IMediaService {
  upload(file: Buffer, fileName: string): Promise<string>;
}
