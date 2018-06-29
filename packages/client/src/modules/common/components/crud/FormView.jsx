import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { onSubmit, mapFormPropsToValues } from '../../../../utils/crud';
import { createFormFields } from '../../util';
import { FormView, Button } from '../native';
//import { minLength, required, validateForm } from '../../../../../../common/validation';

//const formSchema = {
//  name: [required, minLength(3)]
//};

//const validate = values => validateForm(values, formSchema);

const Form = ({ schema, data: { node }, updateEntry, createEntry }) => {
  return (
    <Formik
      initialValues={mapFormPropsToValues({ schema, data: node })}
      onSubmit={async values => {
        let title = node && node.__typename ? node.__typename : 'Model',
          data = node || null;

        await onSubmit({ schema, values, updateEntry, createEntry, title, data });
      }}
      render={({ handleSubmit, values, setFieldValue }) => (
        <FormView>
          {createFormFields(schema, values, setFieldValue)}
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
