import { Directive, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'div[ngrxFormControlState]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgrxRenderSelectValueAccessor),
      multi: true
    }
  ]
})
export default class NgrxRenderSelectValueAccessor implements ControlValueAccessor {
  public writeValue(obj: any): void {}

  public registerOnChange(fn: any): void {}

  public registerOnTouched(fn: any): void {}
}
