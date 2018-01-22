import { Component, Input } from '@angular/core';

@Component({
  selector: 'container',
  template: `
    <div>
        <ng-content></ng-content>
    </div>
  `
})
export default class Container {
  @Input() public classN: string;
  @Input() public styleN: string;
}
