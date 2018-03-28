import { ImageFile } from 'react-dropzone';

/* --- ENTITIES --- */
// tslint:disable-next-line:no-empty-interface
interface File extends ImageFile {}

/**
 * Errors
 */
interface Error {
  error: string;
}

/**
 * Types
 */
type UploadFilesFn = (files: File[]) => Promise<boolean | Error>;
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
  files: File[];
}

interface UploadProps extends UploadOption, UploadQueryResult {}

export { UploadOption, UploadQueryResult, UploadProps };
export { RemoveFileFn, UploadFilesFn };
export { UploadState };
export { File };
