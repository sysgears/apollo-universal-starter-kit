import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormView, RenderField, FormButton } from '../../common/components/native';

const required = value => (value ? undefined : 'Required');

const $Module$Form = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <FormView>
      <Field name="name" component={RenderField} type="text" label="Name" validate={required} />
      <FormButton onPress={handleSubmit(onSubmit)} disabled={!valid}>
        Save
      </FormButton>
    </FormView>
  );
};

$Module$Form.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

export default reduxForm({
  form: '$module$',
  enableReinitialize: true
})($Module$Form);
