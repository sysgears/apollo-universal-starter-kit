import { Component } from '@angular/core';

@Component({
  selector: 'layout-center',
  template: `
    <container class="layout-center">
      <div class="ant-row-flex ant-row-flex-space-between">
        <div class="ant-col-3"></div>
        <div class="ant-col-9">
          <ng-content></ng-content>
        </div>
        <div class="ant-col-3"></div>
      </div>
    </container>
  `
})
export default class LayoutCenter {}
