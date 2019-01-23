import { isApolloError, ApolloError } from 'apollo-client';
import { GraphQLError } from 'graphql';

export const isFormError = (err: any) => err instanceof FormError;

export class FormError {
  public _errors: { [key: string]: any };

  constructor(errorMsg: string, err?: any) {
    if (!!err) {
      if (err && err.networkError) {
        throw new ApolloError(err);
      } else if (isApolloError(err)) {
        this._errors = {
          ...err.graphQLErrors.reduce(
            (
              result: GraphQLError,
              {
                extensions: {
                  exception: { errors }
                }
              }: GraphQLError
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
