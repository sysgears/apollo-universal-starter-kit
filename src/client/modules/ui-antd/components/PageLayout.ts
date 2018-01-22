import { Component } from '@angular/core';
import '../styles/styles.scss';

@Component({
  selector: 'page-layout',
  template: `
    <div class="ant-layout">
      <div class="ant-layout-header">
        <nav-bar></nav-bar>
      </div>
      <div class="ant-layout-content" style="background: #fff; padding: 24px; minHeight: 280">
        <container>
          <router-outlet></router-outlet>
        </container>
      </div>
      <div class="ant-layout-footer" style="text-align:center">
        &copy; 2017. Example Apollo App.
      </div>
    </div>
  `
})
export default class {}
