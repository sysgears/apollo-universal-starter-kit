/**
 * Errors
 */
interface Error {
  error: string;
}

/**
 * Types
 */
type UploadFilesFn = (files: any[]) => Promise<boolean | Error>;
type RemoveFileFn = (id: number) => Promise<boolean | Error>;

/* --- COMPONENT STATE --- */
interface UploadState {
  error: string | null;
}
/* --- COMPONENT PROPS --- */

/**
 * Mutation props
 */
interface UploadOption {
  uploadFiles: UploadFilesFn;
  removeFile: RemoveFileFn;
}

/**
 * Query props
 */
interface UploadQueryResult {
  files: any[];
}

interface UploadProps extends UploadOption, UploadQueryResult {}

export { UploadOption, UploadQueryResult, UploadProps };
export { RemoveFileFn, UploadFilesFn };
export { UploadState };
