import { Error } from '../common/types';

export default class FieldError {
  private errors: Error[];
  constructor() {
    this.errors = [];
  }

  public hasAny(): boolean {
    return !!this.errors.length;
  }

  public setError(field: string, message: string) {
    this.errors = [...this.errors.filter(error => error.field !== field), { field, message }];
  }

  public getErrors(): Error[] {
    return this.errors;
  }

  public throwIf() {
    if (this.hasAny()) {
      throw this.getErrors();
    }
  }
}
