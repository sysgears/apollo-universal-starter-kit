import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

export enum ButtonSize {
  XS = 0,
  Small = 1,
  Default = 2,
  Large = 3
}

export enum ButtonStyle {
  Empty = 0,
  Default = 1,
  Primary = 2,
  Success = 3,
  Info = 4,
  Warning = 5,
  Danger = 6,
  Link = 7,
  Dashed = 8,
  Close = 9
}

export interface TypedValue {
  type: any;
  value: any;
}

@Component({
  selector: 'ausk-button',
  template: `
    <button type="{{ type || 'button' }}"
            [className]="classNames"
            [disabled]="disabled"
            (click)="onClick()"
            #button>
      <ng-content></ng-content>
    </button>
  `
})
export default class AbstractButton {
  @Input() public type: string;
  @Input() public btnStyle: string;
  @Input() public btnSize: string;
  @Input() public click: any;
  @Input() public disabled: boolean;
  @ViewChild('button') public button: ElementRef;

  public classNames: string;

  public onClick(): void {
    if (this.click) {
      this.click();
      this.button.nativeElement.blur();
    }
  }

  public setClassNames(prefix: string, buttonStyles: TypedValue[], buttonSizes: TypedValue[]) {
    this.classNames = prefix.concat(
      this.findVal(buttonStyles, this.btnStyle || ButtonStyle.Primary),
      ` ${this.findVal(buttonSizes, this.btnSize || ButtonSize.Default)}`
    );
  }

  private findVal(source: TypedValue[], val: any) {
    return source.find((item: any) => item.type === val).value;
  }
}
