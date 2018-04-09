import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import DomainValidation from '@domain-schema/validation';

import { onSubmit, mapFormPropsToValues } from '../../../../utils/crud';
import { createFormFields } from '../../util';
import { Form, FormItem, Button } from '../web';

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 6
    }
  }
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const FormView = ({ schema, updateEntry, createEntry, title, customFields, data }) => {
  return (
    <Formik
      initialValues={mapFormPropsToValues({ schema, data: data ? data.node : null })}
      validate={values => DomainValidation.validate(values, schema)}
      onSubmit={async values => {
        //console.log('onSubmit, values:', pickInputFields({schema, values}));
        await onSubmit({ schema, values, updateEntry, createEntry, title, data: data ? data.node : null });
      }}
      render={({ values, handleChange, handleBlur, handleSubmit }) => (
        <Form name="post" onSubmit={handleSubmit}>
          {createFormFields({
            handleChange,
            handleBlur,
            schema,
            values,
            formItemLayout,
            customFields
          })}
          {/*errors && <Alert color="error">{errors}</Alert>*/}
          <FormItem {...tailFormItemLayout}>
            <Button color="primary" type="submit">
              Save
            </Button>
          </FormItem>
        </Form>
      )}
    />
  );
};

FormView.propTypes = {
  updateEntry: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  createEntry: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  customFields: PropTypes.object,
  data: PropTypes.object
};

export default FormView;
