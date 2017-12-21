import { Component } from '@angular/core';

@Component({
  selector: 'card-group',
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `
})
export default class CardGroup {}
