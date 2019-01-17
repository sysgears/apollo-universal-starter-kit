import { GraphQLError } from 'graphql';

export class FormErrors {
  private _errors: { [key: string]: any };

  constructor(errors: { [key: string]: [GraphQLError] }, errorMsg: string) {
    this._errors = {};
    this.setErrors(errors.graphQLErrors, errorMsg);
  }

  get errors() {
    return this._errors;
  }

  private setErrors(graphQLErrors: [GraphQLError], errorMsg: string) {
    graphQLErrors.map(
      ({
        extensions: {
          exception: { errors }
        }
      }) => (this._errors = { ...errors, errorMsg })
    );
  }
}
