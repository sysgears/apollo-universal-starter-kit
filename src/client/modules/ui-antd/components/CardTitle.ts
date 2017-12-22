import { Component } from '@angular/core';

@Component({
  selector: 'card-title',
  template: `
    <h1 style="-webkit-margin-after: 0.67em;">
      <ng-content></ng-content>
    </h1>
  `
})
export default class CardTitle {}
