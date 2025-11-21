
export interface IMediaRepository {
  upload(file: Buffer, fileName: string): Promise<string>;
}
