import React, { ComponentType } from 'react';
import { ExecutionResult } from 'react-apollo';
import { FieldError } from '@module/validation-common-react';

export type HandleFormErrorsFn = (
  graphqlOperation: () => Promise<ExecutionResult>,
  errorMsg: string
) => Promise<ExecutionResult>;

export const withFormErrorHandler = (Component: ComponentType) => {
  const handleFormErrors: HandleFormErrorsFn = async (
    graphqlOperation: () => Promise<ExecutionResult>,
    errorMsg: string
  ) => {
    const result = await graphqlOperation();
    const errors = new FieldError(result.errors);

    if (errors.hasAny()) {
      throw { ...errors.errors, errorMsg };
    }

    return result;
  };

  return (props: any) => <Component {...props} handleFormErrors={handleFormErrors} />;
};
