import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { UploadInput, UploadOutput } from 'ngx-uploader/src/ngx-uploader/classes/interfaces';
import UploadService from '../containers/Upload';

@Component({
  selector: 'upload-view',
  template: `
      <div id="content" class="container">
          <div class="text-center mt-4 mb-4">
              <label class="upload-button">
                  <div class="drop-container" ngFileDrop (uploadOutput)="onUploadOutput($event)"
                       [uploadInput]="uploadInput" [ngClass]="{ 'dragOver': dragOver }">
                      <input type="file" ngFileSelect (uploadOutput)="onUploadOutput($event)"
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
export default class UploadView {
  public uploadInput: EventEmitter<UploadInput>;
  public dragOver: boolean;

  constructor(private uploadService: UploadService, private httpClient: HttpClient) {
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'addedToQueue') {
      const outputFile = output.file;
      const file = {
        name: outputFile.name,
        type: outputFile.type,
        size: outputFile.size,
        path: ''
      };
      this.uploadService.uploadFile(file).subscribe();
      this.httpClient.post('/graphql', outputFile.form).subscribe();
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }
}
