import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'row',
  template: `
    <div *ngIf="!noGutters;else withoutGutters" class="gutter-box">
      <ng-content></ng-content>
    </div>
    <ng-template #withoutGutters>
      <ng-content></ng-content>
    </ng-template>
	`,
  encapsulation: ViewEncapsulation.None
})
export default class Row implements OnInit {
  @Input() public noGutters: boolean;
  @Input() public justifyContent: string;
  @Input() public justifyContentXs: string;
  @Input() public justifyContentSm: string;
  @Input() public justifyContentMd: string;
  @Input() public justifyContentLg: string;
  @Input() public justifyContentXl: string;
  @Input() public classNames: string;

  private justifies: any[] = [
    { justifyContent: 'ant-row-flex' },
    { justifyContentXs: 'ant-row-flex-xs' },
    { justifyContentSm: 'ant-row-flex-sm' },
    { justifyContentMd: 'ant-row-flex-md' },
    { justifyContentLg: 'ant-row-flex-lg' },
    { justifyContentXl: 'ant-row-flex-xl' }
  ];

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.addClassToElement('ant-row-flex');
    this.setGutters();
    this.generateUiClasses(this.justifies);
    if (this.classNames) {
      this.classNames.split(' ').forEach((className: string) => this.addClassToElement(className));
    }
  }

  private setGutters() {
    if (!this.noGutters) {
      this.addClassToElement('gutter-row');
    }
  }

  private generateUiClasses(values: any[]) {
    values.forEach(item => {
      const key = Object.keys(item)[0];
      if (this[key]) {
        this.addClassToElement(item[key], this[key]);
      }
    });
  }

  private addClassToElement(className: string, value?: string) {
    const colClass = value ? `${className}-${value}` : className;
    this.renderer.addClass(this.element.nativeElement, colClass);
  }
}
