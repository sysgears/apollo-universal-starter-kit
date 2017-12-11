import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import { createFormFields } from '../../common/util';
import { $Module$ as $Module$Schema } from '../../../../server/modules/$module$/schema';
import { FormView, FormButton } from '../../common/components/native';

const $Module$Form = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <FormView>
      {createFormFields($Module$Schema)}
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
