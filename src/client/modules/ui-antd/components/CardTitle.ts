import { Component } from '@angular/core';

@Component({
  selector: 'card-title',
  template: `
    <div class="ant-card-head-title">
      <ng-content></ng-content>
    </div>
  `
})
export default class CardTitle {}
