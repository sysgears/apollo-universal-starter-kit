import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'column',
  template: `
     <div class="{{ classes.join(' ') }}">
         <ng-content></ng-content>
     </div>
	`
})
export default class Col implements OnInit {
  // Sizes
  @Input() private xs: number;
  @Input() private sm: number;
  @Input() private md: number;
  @Input() private lg: number;
  @Input() private xl: number;
  private sizes: any[] = [{ xs: 'col' }, { sm: 'col-sm' }, { md: 'col-md' }, { lg: 'col-lg' }, { xl: 'col-xl' }];
  // Offsets
  @Input() private xsOffset: number;
  @Input() private smOffset: number;
  @Input() private mdOffset: number;
  @Input() private lgOffset: number;
  @Input() private xlOffset: number;
  private offsets: any[] = [
    { xsOffset: 'offset' },
    { smOffset: 'offset-sm' },
    { mdOffset: 'offset-md' },
    { lgOffset: 'offset-lg' },
    { xlOffset: 'offset-xl' }
  ];
  // Pulls
  @Input() private xsPull: number;
  @Input() private smPull: number;
  @Input() private mdPull: number;
  @Input() private lgPull: number;
  @Input() private xlPull: number;
  private pulls: any[] = [
    { xsPull: 'pull' },
    { smPull: 'pull-sm' },
    { mdPull: 'pull-md' },
    { lgPull: 'pull-lg' },
    { xlPull: 'pull-xl' }
  ];
  // Pushes
  @Input() private xsPush: number;
  @Input() private smPush: number;
  @Input() private mdPush: number;
  @Input() private lgPush: number;
  @Input() private xlPush: number;
  private pushes: any[] = [
    { xsPush: 'push' },
    { smPush: 'push-sm' },
    { mdPush: 'push-md' },
    { lgPush: 'push-lg' },
    { xlPush: 'push-xl' }
  ];
  public classes: string[] = [];

  public ngOnInit(): void {
    this.generateUiClasses(this.sizes, 'col-auto');
    this.generateUiClasses(this.offsets.concat(this.pulls, this.pushes));
  }

  private generateUiClasses(values: any[], defaultValue?: string) {
    const needDefault = values.reduce((allZero, item) => {
      const key = this[Object.keys(item)[0]];
      const value = item[Object.keys(item)[0]];
      if (key) {
        allZero = false;
        this.classes.push(this.generateClass(value, key));
      }
      return allZero;
    }, true);

    if (defaultValue && needDefault) {
      this.classes.push(this.generateClass(defaultValue));
    }
  }

  private generateClass(className: string, value?: number) {
    return value ? `${className}-${value}` : className;
  }
}
