import { Component } from '@angular/core';

@Component({
  selector: 'ausk-card',
  template: `
    <div class="ant-card ant-card-bordered">
      <ng-content></ng-content>
    </div>
  `
})
export default class Card {}
