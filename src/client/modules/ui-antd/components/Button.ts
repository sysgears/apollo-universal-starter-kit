import { Component, Input, OnInit } from '@angular/core';
import { ButtonSize, ButtonStyle } from '../../common/components/Button';

const buttonSizes = [
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

const buttonStyles = [
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
  @Input() public classes: string;
  @Input() public click: any;
  @Input() public disabled: boolean;
  @Input() public size: any;

  public classNames: string;
  public buttonSize: string;

  public ngOnInit(): void {
    this.classNames = '';

    if (this.classes) {
      this.classNames += buttonStyles.find((buttonClass: any) => buttonClass.type === this.classes).value;
    } else {
      this.classNames += buttonStyles.find((buttonClass: any) => buttonClass.type === ButtonStyle.Primary).value;
    }

    if (this.size) {
      this.buttonSize = buttonSizes.find((buttonClass: any) => buttonClass.type === this.size).value;
    }
  }

  public onClick(): void {
    if (this.click) {
      this.click();
    }
  }
}
