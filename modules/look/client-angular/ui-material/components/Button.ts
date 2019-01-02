import { Component } from '@angular/core';

@Component({
  selector: 'btn',
  template: `<button mat-raised-button color="primary"><ng-content></ng-content></button>`,
  styles: []
})
export class ButtonComponent {}
