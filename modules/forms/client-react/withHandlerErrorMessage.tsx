import React, { ComponentType } from 'react';
import { FieldError, Errors } from '@module/validation-common-react';

type PromiseObject = Promise<{ errors: Errors }>;

type AsyncCallback = () => PromiseObject;

type WithHandlerErrorMessage = (Component: ComponentType) => ComponentType;

export type HandleError = (asyncCallback: AsyncCallback, errorMsg: string) => PromiseObject;

export const withHandlerErrorMessage: WithHandlerErrorMessage = (Component: ComponentType) => {
  const handleError: HandleError = async (asyncCallback: AsyncCallback, errorMsg: string) => {
    const result = await asyncCallback();

    const errors = new FieldError(result.errors);

    if (errors.hasAny()) {
      throw { ...errors.errors, errorMsg };
    }

    return result;
  };

  return (props: any) => <Component {...props} handleError={handleError} />;
};
