import { isApolloError } from 'apollo-client';
import { GraphQLError } from 'graphql';

export const isFormError = (err: any) => err instanceof FormError;

export class FormError {
  private readonly _errors: { [key: string]: any };

  constructor(errorMsg: string, err?: any) {
    if (err) {
      if (isApolloError(err)) {
        if (err.networkError) {
          throw err;
        } else {
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
        }
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
