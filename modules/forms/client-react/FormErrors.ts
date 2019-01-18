import { GraphQLError } from 'graphql';

export class FormErrors {
  public _errors: { [key: string]: any };

  constructor(err: { [key: string]: [GraphQLError] }, errorMsg: string) {
    this._errors = {
      ...err.graphQLErrors.reduce((result, { extensions: { exception: { errors } } }) => {
        return { ...result, ...errors };
      }, {}),
      errorMsg
    };
  }
  get errors() {
    return this._errors;
  }
}
