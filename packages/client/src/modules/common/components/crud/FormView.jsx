import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
//import DomainValidator from '@domain-schema/validation';

import { onSubmit, mapFormPropsToValues } from '../../../../utils/crud';
import { createFormFields } from '../../util';
import { FormView, Button } from '../native';
//import { computeDomainValidationErrors } from '../../../../../../common/validation';

const Form = ({ schema, data: { node }, updateEntry, createEntry }) => {
  // const domainValidator = new DomainValidator();
  return (
    <Formik
      initialValues={mapFormPropsToValues({ schema, data: node })}
      /*      validate={values => {
        let rawErrors = domainValidator.validate(schema, values);
        return computeDomainValidationErrors(rawErrors);
      }}*/
      onSubmit={async values => {
        let title = node && node.__typename ? node.__typename : 'Model',
          data = node || null;

        await onSubmit({ schema, values, updateEntry, createEntry, title, data });
      }}
      render={({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
        <FormView>
          {createFormFields(schema, values, setFieldValue, setFieldTouched)}
          <Button onPress={handleSubmit}>Save</Button>
        </FormView>
      )}
    />
  );
};

Form.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.object,
  updateEntry: PropTypes.func.isRequired,
  createEntry: PropTypes.func.isRequired
};

export default Form;
