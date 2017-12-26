import { Component } from '@angular/core';

@Component({
  selector: 'ausk-card',
  template: `
     <div class="card">
         <ng-content></ng-content>
     </div>
	`
})
export class Card {}
