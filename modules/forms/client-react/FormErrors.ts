export class FormErrors {
  public _errors: { [key: string]: any };

  constructor(errorMsg: string, err?: { [key: string]: [any] }) {
    if (!!err) {
      if (err && err.graphQLErrors) {
        this._errors = {
          ...err.graphQLErrors.reduce((result, { extensions: { exception: { errors } } }) => {
            return { ...result, ...errors };
          }, {}),
          errorMsg
        };
      } else {
        throw err;
      }
    } else {
      this._errors = { errorMsg };
    }
  }

  get errors() {
    return this._errors;
  }
}
