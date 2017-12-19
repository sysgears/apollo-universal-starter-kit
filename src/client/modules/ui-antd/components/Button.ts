import { Component, Input, OnInit } from '@angular/core';
import { ButtonSize, ButtonStyle, findVal, TypedValue } from '../../common/components/Button';

const buttonSizes: TypedValue[] = [
  {
    type: ButtonSize.XS,
    value: 'small'
  },
  {
    type: ButtonSize.Small,
    value: 'small'
  },
  {
    type: ButtonSize.Default,
    value: 'default'
  },
  {
    type: ButtonSize.Large,
    value: 'large'
  }
];

const buttonStyles: TypedValue[] = [
  {
    type: ButtonStyle.Empty,
    value: ''
  },
  {
    type: ButtonStyle.Default,
    value: 'default'
  },
  {
    type: ButtonStyle.Primary,
    value: 'primary'
  },
  {
    type: ButtonStyle.Success,
    value: 'primary'
  },
  {
    type: ButtonStyle.Info,
    value: 'primary'
  },
  {
    type: ButtonStyle.Warning,
    value: 'primary'
  },
  {
    type: ButtonStyle.Danger,
    value: 'danger'
  },
  {
    type: ButtonStyle.Link,
    value: 'primary'
  },
  {
    type: ButtonStyle.Dashed,
    value: 'dashed'
  },
  {
    type: ButtonStyle.Close,
    value: 'close'
  }
];

@Component({
  selector: 'ausk-button',
  template: `
    <button nz-button [nzType]="classNames" [nzSize]="buttonSize"
        type="{{ type || 'button' }}"
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
  public buttonSize: string;

  public ngOnInit(): void {
    this.classNames = findVal(buttonStyles, this.btnStyle || ButtonStyle.Primary);
    this.buttonSize = findVal(buttonSizes, this.btnSize || ButtonSize.Default);
  }

  public onClick(): void {
    if (this.click) {
      this.click();
    }
  }
}
