import { Component, Input, OnInit } from '@angular/core';
import { ButtonSize, ButtonStyle, findVal, TypedValue } from '../../common/components/Button';

const buttonSizes: TypedValue[] = [
  {
    type: ButtonSize.XS,
    value: 'btn btn-xs'
  },
  {
    type: ButtonSize.Small,
    value: 'btn btn-sm'
  },
  {
    type: ButtonSize.Default,
    value: 'btn btn-md'
  },
  {
    type: ButtonSize.Large,
    value: 'btn btn-lg'
  }
];

const buttonStyles: TypedValue[] = [
  {
    type: ButtonStyle.Empty,
    value: ''
  },
  {
    type: ButtonStyle.Default,
    value: 'btn btn-default'
  },
  {
    type: ButtonStyle.Primary,
    value: 'btn btn-primary'
  },
  {
    type: ButtonStyle.Success,
    value: 'btn btn-success'
  },
  {
    type: ButtonStyle.Info,
    value: 'btn btn-info'
  },
  {
    type: ButtonStyle.Warning,
    value: 'btn btn-warning'
  },
  {
    type: ButtonStyle.Danger,
    value: 'btn btn-danger'
  },
  {
    type: ButtonStyle.Link,
    value: 'btn btn-link'
  },
  {
    type: ButtonStyle.Dashed,
    value: 'btn btn-primary'
  },
  {
    type: ButtonStyle.Close,
    value: 'close'
  }
];

@Component({
  selector: 'ausk-button',
  template: `
    <button
        type="{{ type || 'button' }}"
        [className]="classNames"
        [disabled]="disabled"
        (click)="onClick()">
      <ng-content></ng-content>
    </button>
  `
})
export default class Button implements OnInit {
  @Input() public type: string;
  @Input() public btnStyle: string;
  @Input() public click: any;
  @Input() public disabled: boolean;
  @Input() public btnSize: any;

  public classNames: string;

  public ngOnInit(): void {
    this.classNames = ''.concat(
      findVal(buttonStyles, this.btnStyle || ButtonStyle.Primary),
      ` ${findVal(buttonSizes, this.btnSize || ButtonSize.Default)}`
    );
  }

  public onClick(): void {
    if (this.click) {
      this.click();
    }
  }
}
