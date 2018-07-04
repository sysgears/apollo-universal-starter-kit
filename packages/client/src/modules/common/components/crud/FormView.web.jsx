import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import DomainValidator from '@domain-schema/validation';

import { onSubmit, mapFormPropsToValues } from '../../../../utils/crud';
import { createFormFields } from '../../util';
import { Form, FormItem, Button } from '../web';
import { computeDomainValidationErrors } from '../../../../../../common/validation';

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
  const domainValidator = new DomainValidator();
  return (
    <Formik
      initialValues={mapFormPropsToValues({ schema, data: data ? data.node : null })}
      validate={values => {
        let rawErrors = domainValidator.validate(schema, values);
        return computeDomainValidationErrors(rawErrors);
      }}
      onSubmit={async values => {
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
