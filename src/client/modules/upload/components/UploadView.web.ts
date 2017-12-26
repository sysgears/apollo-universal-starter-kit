import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { UploadOutput } from 'ngx-uploader/src/ngx-uploader/classes/interfaces';
import { Subscription } from 'rxjs/Subscription';

import { UploadService } from '../containers/Upload';

@Component({
  selector: 'upload-view',
  template: `
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
export class UploadView implements OnDestroy {
  @ViewChild('fileInput') public fileInput: ElementRef;
  public dragOver: boolean;
  private subsOnUpload: Subscription;

  constructor(private uploadService: UploadService) {}

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnUpload);
  }

  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'addedToQueue') {
      this.unsubscribe(this.subsOnUpload);
      this.subsOnUpload = this.uploadService.uploadFile(output.file.nativeFile, (result: any) => {
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

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
  };
}
