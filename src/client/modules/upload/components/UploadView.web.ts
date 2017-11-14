import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { UploadOutput } from 'ngx-uploader/src/ngx-uploader/classes/interfaces';
import { Subscription } from 'rxjs/Subscription';
import UploadService from '../containers/Upload';

@Component({
  selector: 'upload-view',
  template: `
      <div id="content" class="container">
          <div class="text-center mt-4 mb-4">
              <label class="upload-button">
                  <div class="drop-container" ngFileDrop (uploadOutput)="onUploadOutput($event)"
                       [uploadInput]="uploadInput" [ngClass]="{ 'dragOver': dragOver }">
                      <input #fileInput type="file" ngFileSelect (uploadOutput)="onUploadOutput($event)"
                             [uploadInput]="uploadInput" multiple style="display: none">
                      Try dropping some files here, or click to select files to upload.
                  </div>
              </label>
          </div>
      </div>
  `,
  styles: [
    `
      .drop-container {
          width: 200px;
          height: 200px;
          border-width: 2px;
          border-style: dashed;
          border-color: rgb(102, 102, 102);
          border-radius: 5px;
      }

      .dragOver {
          border-color: rgb(102, 204, 102);
          border-style: solid;
          background-color: rgb(238, 238, 238);
      }

      label {
          display: block;
      }
    `
  ]
})
export default class UploadView implements OnDestroy {
  private subsOnUpload: Subscription;
  public dragOver: boolean;
  @ViewChild('fileInput') public fileInput: ElementRef;

  constructor(private uploadService: UploadService) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'addedToQueue') {
      this.unsubscribe();
      this.subsOnUpload = this.uploadService.uploadFile(output.file.nativeFile).subscribe((result: any) => {
        this.fileInput.nativeElement.value = '';
        // console.log(result);
      });
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  private unsubscribe() {
    if (this.subsOnUpload) {
      this.subsOnUpload.unsubscribe();
    }
  }
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
// import Dropzone from 'react-dropzone';
// import { PageLayout } from '../../common/components/web';
//
// const onDrop = uploadFile => async ([file]) => {
//   const result = await uploadFile(file);
//   console.log(result);
// };
//
// const UploadView = ({ uploadFile }) => {
//   const renderMetaData = () => (
//     <Helmet
//       title="Upload"
//   meta={[
//     {
//       name: 'description',
//       content: 'Upload page'
//     }
//     ]}
//   />
// );
//
//   return (
//     <PageLayout>
//       {renderMetaData()}
//     <div className="text-center mt-4 mb-4">
//   <Dropzone onDrop={onDrop(uploadFile)}>
//     <p>Try dropping some files here, or click to select files to upload.</p>
//   </Dropzone>
//   </div>
//   </PageLayout>
// );
// };
//
// UploadView.propTypes = {
//   uploadFile: PropTypes.func.isRequired
// };
//
// export default UploadView;
