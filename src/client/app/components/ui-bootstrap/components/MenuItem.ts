import { Component } from '@angular/core';

@Component({
  selector: 'menu-item',
  template: `
	  <li class="nav-item">
				<ng-content></ng-content>
		</li>
	`
})
export class MenuItem {}
