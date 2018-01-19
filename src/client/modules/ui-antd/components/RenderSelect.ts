import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { FormInput } from './Form';

@Component({
  selector: 'render-select',
  template: `
    <div class="ant-row ant-form-item">
      <div class="ant-form-item-label">
        <label *ngIf="input.label" for="{{input.id}}">{{input.label}}</label>
      </div>
      <div class="ant-form-item-control-wrapper">
        <div class="ant-form-item-control ">
          <div>
            <div class="ant-select ant-select-enabled" (click)="onClick()" #select>
              <div class="ant-select-selection ant-select-selection-single">
                <div class="ant-select-selection__rendered">
                  <div id="{{input.id}}"
                       [ngrxFormControlState]="reduxForm.controls[input.name]"
                       [ngrxEnableFocusTracking]="true"
                       title="{{input.name}}"
                       class="ant-select-selection-selected-value"
                       style="display: block; opacity: 1;"
                       (ngModelChange)="changed({ id: input.id, value: $event })"
                       [(ngModel)]="reduxForm?.value[input.name]"
                  >
                  </div>
                  {{reduxForm?.value[input.name]}}
                </div>
                <span class="ant-select-arrow" unselectable="on" style="user-select: none;"><b></b></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="position: absolute; top: 0px; left: 0px; width: 100%;">
      <div>
        <div class="ant-select-dropdown ant-select-dropdown--single ant-select-dropdown-placement-bottomLeft
        ant-select-dropdown-hidden" #options>
          <div style="overflow: auto;">
            <ul class="ant-select-dropdown-menu ant-select-dropdown-menu-root ant-select-dropdown-menu-vertical">
              <li *ngFor="let o of input.options"
                  unselectable="unselectable"
                  class="ant-select-dropdown-menu-item"
                  [ngClass]="{'ant-select-dropdown-menu-item-selected': reduxForm?.value[input.name] === o}"
                  style="user-select: none;"
                  (click)="onItemClick($event)">
                {{o}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="reduxForm.controls[input.name].isInvalid && (reduxForm.controls[input.name].isDirty || reduxForm.controls[input.name].isTouched)">
      <small [hidden]="!reduxForm.controls[input.name].errors[input.name]">
        {{reduxForm.controls[input.name].errors[input.name]}}
      </small>
      <small [hidden]="!reduxForm.controls[input.name].errors.required">
        {{input.value}} is required
      </small>
    </div>
  `,
  styles: ['small {color: brown}'],
  host: {
    '(document:click)': 'closeDropdown($event)',
    '(window:resize)': 'setDropdownBounds()'
  }
})
export default class RenderSelect {
  @Input() public input: FormInput;
  @Input() public reduxForm: any;
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(`select`)
  public select: ElementRef;
  @ViewChild(`options`)
  public options: ElementRef;

  constructor(private renderer: Renderer2) {}

  public changed = (e: any) => {
    this.onChange.emit(e);
  };

  public onClick(): void {
    this.setDropdownBounds();
    this.toggleDropdown();
  }

  public onItemClick(e: any): void {
    this.reduxForm.controls[this.input.name].value = e.target.innerText;
    this.reduxForm.value[this.input.name] = e.target.innerText;
    this.toggleDropdown();
  }

  public closeDropdown(e: any) {
    if (!this.select.nativeElement.contains(e.target) && this.isActive()) {
      this.toggleDropdown();
    }
  }

  public toggleDropdown(): void {
    const action = this.isActive() ? ['removeClass', 'addClass'] : ['addClass', 'removeClass'];
    this.renderer[action[0]](this.select.nativeElement, 'ant-select-open');
    this.renderer[action[0]](this.select.nativeElement, 'ant-select-focused');
    this.renderer[action[1]](this.options.nativeElement, 'ant-select-dropdown-hidden');
  }

  public setDropdownBounds(): void {
    const params = this.getParams(this.select.nativeElement);
    this.options.nativeElement.style.top = `${params.top}px`;
    this.options.nativeElement.style.left = `${params.left}px`;
    this.options.nativeElement.style.width = `${params.width}px`;
  }

  private isActive(): boolean {
    return this.select.nativeElement.classList.contains('ant-select-open');
  }

  private getParams(el: any): { top: number; left: number; width: number } {
    const height = el.getBoundingClientRect().height;
    const width = el.getBoundingClientRect().width;
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y + height + 1, left: x, width };
  }
}
