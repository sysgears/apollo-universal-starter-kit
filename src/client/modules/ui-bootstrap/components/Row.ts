import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'row',
  template: `
     <div class="{{ classes.join(' ') }}">
         <ng-content></ng-content>
     </div>
	`
})
export default class Row implements OnInit {
  @Input() private noGutters: boolean;
  @Input() private justifyContent: string;
  @Input() private justifyContentSm: string;
  @Input() private justifyContentMd: string;
  @Input() private justifyContentLg: string;
  @Input() private justifyContentXs: string;

  private justifies: any[] = [
    { justifyContent: 'justify-content' },
    { justifyContentSm: 'justify-content-sm' },
    { justifyContentMd: 'justify-content-md' },
    { justifyContentLg: 'justify-content-lg' },
    { justifyContentXl: 'justify-content-xl' }
  ];
  public classes: string[] = ['row'];

  public ngOnInit(): void {
    this.setGutters();
    this.generateUiClasses(this.justifies);
  }

  private setGutters() {
    if (this.noGutters) {
      this.classes.push('no-gutters');
    }
  }

  private generateUiClasses(values: any[]) {
    values.forEach(item => {
      const key = this[Object.keys(item)[0]];
      const value = item[Object.keys(item)[0]];
      if (key) {
        this.classes.push(this.generateClass(value, key));
      }
    });
  }

  private generateClass(className: string, value: string) {
    return `${className}-${value}`;
  }
}
