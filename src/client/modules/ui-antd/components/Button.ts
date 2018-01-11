import { Component, Input, OnInit } from '@angular/core';
import { ButtonSize, ButtonStyle, findVal, TypedValue } from '../../common/components/Button';

const buttonSizes: TypedValue[] = [
  {
    type: ButtonSize.XS,
    value: 'ant-btn-sm'
  },
  {
    type: ButtonSize.Small,
    value: 'ant-btn-sm'
  },
  {
    type: ButtonSize.Default,
    value: ''
  },
  {
    type: ButtonSize.Large,
    value: 'ant-btn-lg'
  }
];

const buttonStyles: TypedValue[] = [
  {
    type: ButtonStyle.Empty,
    value: ''
  },
  {
    type: ButtonStyle.Default,
    value: ''
  },
  {
    type: ButtonStyle.Primary,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Success,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Info,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Warning,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Danger,
    value: 'ant-btn-danger'
  },
  {
    type: ButtonStyle.Link,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Dashed,
    value: 'ant-btn-dashed'
  },
  {
    type: ButtonStyle.Close,
    value: 'ant-btn-primary'
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
    this.classNames = 'ant-btn '.concat(
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
