import { Component } from '@angular/core';

@Component({
  selector: 'users',
  template: `
      <div id="content" class="container">
          <h2>Users</h2>
          <a [routerLink]="['/users/0']">
              <button class="btn btn-primary">Add</button>
          </a>
          <hr>
          <users-filter-view></users-filter-view>
          <hr>
          <users-list-view></users-list-view>
      </div>
  `
})
export default class Users {}
