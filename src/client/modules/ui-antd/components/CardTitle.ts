import { Component } from '@angular/core';

@Component({
  selector: 'card-title',
  template: `
     <h4 class="card-title">
         <ng-content></ng-content>
     </h4>
	`
})
export default class CardTitle {}
