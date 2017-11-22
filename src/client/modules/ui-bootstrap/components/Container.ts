import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'container',
  template: `
     <div class="{{ className }}">
         <ng-content></ng-content>
     </div>
	`
})
export default class Container implements OnInit {
  @Input() private fluid: boolean;
  public className: string;

  public ngOnInit(): void {
    this.className = `container${this.fluid ? '-fluid' : ''}`;
  }
}
