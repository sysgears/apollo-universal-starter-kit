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

const Form = ({ schema, data: { node } }) => {
  return (
    <Formik
      initialValues={mapFormPropsToValues({ schema, data: node })}
      onSubmit={async values => {
        //console.log('onSubmit, values:', pickInputFields({schema, values}));
        await onSubmit({ schema, values });
      }}
      render={({ handleChange, handleSubmit }) => (
        <FormView>
          {createFormFields({ handleChange, schema })}
          <Button onPress={handleSubmit}>Save</Button>
        </FormView>
      )}
    />
  );
};

Form.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.object
};

export default Form;
