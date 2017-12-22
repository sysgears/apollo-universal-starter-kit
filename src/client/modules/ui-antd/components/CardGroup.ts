import { Component } from '@angular/core';

@Component({
  selector: 'card-group',
  template: `
     <div class="card-body">
         <ng-content></ng-content>
     </div>
	`
})
export class CardGroup {}
