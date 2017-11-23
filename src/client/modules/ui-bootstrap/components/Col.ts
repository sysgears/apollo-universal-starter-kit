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
  public sizes: any[] = [{ xs: 'col' }, { sm: 'col-sm' }, { md: 'col-md' }, { lg: 'col-lg' }, { xl: 'col-xl' }];
  // Offsets
  @Input() public xsOffset: number;
  @Input() public smOffset: number;
  @Input() public mdOffset: number;
  @Input() public lgOffset: number;
  @Input() public xlOffset: number;
  public offsets: any[] = [
    { xsOffset: 'offset' },
    { smOffset: 'offset-sm' },
    { mdOffset: 'offset-md' },
    { lgOffset: 'offset-lg' },
    { xlOffset: 'offset-xl' }
  ];
  // Pulls
  @Input() public xsPull: number;
  @Input() public smPull: number;
  @Input() public mdPull: number;
  @Input() public lgPull: number;
  @Input() public xlPull: number;
  public pulls: any[] = [
    { xsPull: 'pull' },
    { smPull: 'pull-sm' },
    { mdPull: 'pull-md' },
    { lgPull: 'pull-lg' },
    { xlPull: 'pull-xl' }
  ];
  // Pushes
  @Input() public xsPush: number;
  @Input() public smPush: number;
  @Input() public mdPush: number;
  @Input() public lgPush: number;
  @Input() public xlPush: number;
  public pushes: any[] = [
    { xsPush: 'push' },
    { smPush: 'push-sm' },
    { mdPush: 'push-md' },
    { lgPush: 'push-lg' },
    { xlPush: 'push-xl' }
  ];

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.addClasses(this.sizes, 'col-auto');
    this.addClasses(this.offsets.concat(this.pulls, this.pushes));
  }

  private addClasses(values: any[], defaultValue?: string) {
    const needDefault = values.reduce((allZero, item) => {
      const key = this[Object.keys(item)[0]];
      const value = item[Object.keys(item)[0]];
      if (key) {
        allZero = false;
        this.addClassToElement(value, key);
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
