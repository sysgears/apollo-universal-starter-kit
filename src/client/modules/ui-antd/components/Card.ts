import { Component } from '@angular/core';

@Component({
  selector: 'ausk-card',
  template: `
    <div class="ant-card ant-card-bordered">
      <div class="ant-card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export default class Card {}
