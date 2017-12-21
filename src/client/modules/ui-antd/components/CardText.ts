import { Component } from '@angular/core';

@Component({
  selector: 'card-text',
  template: `
    <div class="ant-card-body">
      <ng-content></ng-content>
    </div>
  `
})
export default class CardText {}
