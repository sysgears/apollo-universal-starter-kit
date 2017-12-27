import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'column',
  template: `
    <ng-content></ng-content>
  `,
  encapsulation: ViewEncapsulation.None
})
export default class Col implements OnInit {
  // Sizes
  @Input() public xs: number;
  @Input() public sm: number;
  @Input() public md: number;
  @Input() public lg: number;
  @Input() public xl: number;
  public sizes: any[] = [
    { xs: 'ant-col-xs' },
    { sm: 'ant-col-sm' },
    { md: 'ant-col-md' },
    { lg: 'ant-col-lg' },
    { xl: 'ant-col-xl' }
  ];
  // Offsets
  @Input() public xsOffset: number;
  @Input() public smOffset: number;
  @Input() public mdOffset: number;
  @Input() public lgOffset: number;
  @Input() public xlOffset: number;
  public offsets: any[] = [
    { xsOffset: 'ant-col-offset-xs' },
    { smOffset: 'ant-col-offset-sm' },
    { mdOffset: 'ant-col-offset-md' },
    { lgOffset: 'ant-col-offset-lg' },
    { xlOffset: 'ant-col-offset-xl' }
  ];
  // Pulls
  @Input() public xsPull: number;
  @Input() public smPull: number;
  @Input() public mdPull: number;
  @Input() public lgPull: number;
  @Input() public xlPull: number;
  public pulls: any[] = [
    { xsPull: 'ant-col-pull-xs' },
    { smPull: 'ant-col-pull-sm' },
    { mdPull: 'ant-col-pull-md' },
    { lgPull: 'ant-col-pull-lg' },
    { xlPull: 'ant-col-pull-xl' }
  ];
  // Pushes
  @Input() public xsPush: number;
  @Input() public smPush: number;
  @Input() public mdPush: number;
  @Input() public lgPush: number;
  @Input() public xlPush: number;
  public pushes: any[] = [
    { xsPush: 'ant-col-push-xs' },
    { smPush: 'ant-col-push-sm' },
    { mdPush: 'ant-col-push-md' },
    { lgPush: 'ant-col-push-lg' },
    { xlPush: 'ant-col-push-xl' }
  ];

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.addClasses(this.sizes, 'ant-col');
    this.addClasses(this.offsets.concat(this.pulls, this.pushes));
  }

  private addClasses(values: any[], defaultValue?: string) {
    const needDefault = values.reduce((allZero, item) => {
      const key = Object.keys(item)[0];
      if (this[key]) {
        allZero = false;
        this.addClassToElement(item[key], this[key]);
      }
      return allZero;
    }, true);

    if (defaultValue && needDefault) {
      this.addClassToElement(defaultValue);
    }
  }

  private addClassToElement(className: string, value?: number) {
    const colClass = value ? `${className}-${value}` : className;
    this.renderer.addClass(this.element.nativeElement, colClass);
  }
}
