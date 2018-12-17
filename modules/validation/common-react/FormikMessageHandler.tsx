import React, { ComponentType } from 'react';
import { FieldError } from './FieldError';

export const FormikMessageHandler = (Component: ComponentType) => {
  const handleError = async (
    asyncCallback: () => Promise<{ errors: Array<{ field: string; message: string }>; user: { [key: string]: any } }>,
    messageError: string
  ) => {
    const result = await asyncCallback();

    const errors = new FieldError(result.errors);

    if (errors.hasAny()) {
      throw { ...errors.errors, messageError };
    }

    return result;
  };

  return (props: any) => <Component {...props} handleError={handleError} />;
};
