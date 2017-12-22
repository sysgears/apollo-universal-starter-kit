import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import { createFormFields } from '../../common/util';
import { $Module$ as $Module$Schema } from '../../../../server/modules/$module$/schema';
import { Form, Button, Alert } from '../../common/components/web';

const $Module$Form = ({ handleSubmit, submitting, onSubmit, $module$, error }) => {
  return (
    <Form name="post" onSubmit={handleSubmit(onSubmit)}>
      {createFormFields($Module$Schema, $module$)}
      {error && <Alert color="error">{error}</Alert>}
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

$Module$Form.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  $module$: PropTypes.object,
  error: PropTypes.string
};

export default reduxForm({
  form: '$module$'
})($Module$Form);
