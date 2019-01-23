interface ObjectError {
  [key: string]: any;
}

interface GraphQLErrors {
  extensions: {
    exception: { errors: ObjectError };
  };
}

export class FormErrors {
  public _errors: ObjectError;

  constructor(errorMsg: string, err?: ObjectError) {
    if (!!err) {
      if (err && err.networkError) {
        throw err.networkError;
      } else if (err && err.graphQLErrors) {
        this._errors = {
          ...err.graphQLErrors.reduce(
            (
              result: ObjectError,
              {
                extensions: {
                  exception: { errors }
                }
              }: GraphQLErrors
            ) => ({ ...result, ...errors }),
            {}
          ),
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
