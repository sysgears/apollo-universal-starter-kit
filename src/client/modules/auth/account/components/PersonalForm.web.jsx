import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError, Field, reduxForm } from 'redux-form';

import { pick } from 'lodash';

import { Alert, Button, Form, RenderField } from '../../../common/components/web';

import { required, minLength } from '../../../../../common/validation';

const validate = values => {
  const errors = {};

  console.log('validate:', values);

  return errors;
};

class PersonalForm extends React.Component {
  onSubmit = async values => {
    const { user, savePersonal } = this.props;

    let result = null;

    let insertValues = {};

    insertValues['profile'] = pick(values, [
      'displayName',
      'title',
      'firstName',
      'middleName',
      'lastName',
      'suffix',
      'language',
      'locale'
    ]);
    console.log('onSubmit().personal', insertValues, savePersonal);

    result = await savePersonal({ id: user.id, ...insertValues });

    console.log('result', result);

    if (result.errors) {
      let submitError = {
        _error: 'Edit user failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  render() {
    console.log('PersonalForm this mutha fucka', this);
    let { handleSubmit, submitting, error, onCancel } = this.props;

    return (
      <Form name="user.profile" onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          name="displayName"
          component={RenderField}
          type="text"
          label="Display Name"
          validate={[required, minLength(3)]}
        />

        <Field name="title" component={RenderField} type="text" label="Title" validate={[minLength(2)]} />

        <Field name="firstName" component={RenderField} type="text" label="First Name" validate={[minLength(1)]} />

        <Field name="middleName" component={RenderField} type="text" label="Middle Name" validate={[minLength(1)]} />

        <Field name="lastName" component={RenderField} type="text" label="Last Name" validate={[minLength(1)]} />

        <Field name="suffix" component={RenderField} type="text" label="Suffix" validate={[minLength(1)]} />

        <Field name="language" component={RenderField} type="text" label="Language" validate={[minLength(1)]} />

        <Field name="locale" component={RenderField} type="text" label="Locale" validate={[minLength(1)]} />

        {error && <Alert color="error">{error}</Alert>}

        <div className="float-right">
          <Button color="primary" type="submit" disabled={submitting}>
            Save
          </Button>
          <span> </span>
          <Button color="danger" onClick={onCancel()}>
            Cancel
          </Button>
        </div>
      </Form>
    );
  }
}

PersonalForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  onCancel: PropTypes.func
};

export default reduxForm({
  form: 'user.profile',
  validate
})(PersonalForm);
