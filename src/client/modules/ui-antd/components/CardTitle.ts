import { Component } from '@angular/core';

@Component({
  selector: 'card-title',
  template: `
    <h1>
      <ng-content></ng-content>
    </h1>
  `
})
export default class CardTitle {}
