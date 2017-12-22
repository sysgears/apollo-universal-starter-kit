import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'container',
  template: `
     <div class="{{ className }}">
         <ng-content></ng-content>
     </div>
	`
})
export class Container implements OnInit {
  @Input() public fluid: boolean;
  public className: string;

  public ngOnInit(): void {
    this.className = `container${this.fluid ? '-fluid' : ''}`;
  }
}
