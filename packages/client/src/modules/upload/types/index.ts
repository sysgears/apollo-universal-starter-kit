/**
 * Errors
 */
interface Error {
  error: string;
}

/* --- COMPONENT PROPS --- */

/**
 * Mutation props
 */
interface UploadOption {
  uploadFiles: (files: any[]) => Promise<boolean | Error>;
  removeFile: (id: number) => Promise<boolean | Error>;
}

/**
 * Query props
 */
interface UploadQueryResult {
  files: any[];
}

interface UploadProps extends UploadOption, UploadQueryResult {}

export { UploadOption, UploadQueryResult, UploadProps };
