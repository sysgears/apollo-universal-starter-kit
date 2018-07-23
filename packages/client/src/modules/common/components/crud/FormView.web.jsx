import React from 'react';
import PropTypes from 'prop-types';
import { DomainSchemaFormik } from '@domain-schema/formik';
import { onSubmit } from '../../../../utils/crud';
import { Form, Button, RenderField, RenderSwitch, RenderSelectQuery, RenderDate, RenderNumber } from '../web';

const FormView = ({ schema, updateEntry, createEntry, title, data }) => {
  const schemaFormik = new DomainSchemaFormik(schema);
  schemaFormik.setFormComponents({
    input: RenderField,
    checkbox: RenderSwitch,
    number: RenderNumber,
    date: RenderDate,
    select: RenderSelectQuery,
    button: Button,
    form: Form
  });
  const Formik = schemaFormik.generateForm({
    label: 'Submit',
    disableOnInvalid: false
  });

  return (
    <Formik
      values={data ? data.node : null}
      onSubmit={async values => {
        await onSubmit({ schema, values, updateEntry, createEntry, title, data: data ? data.node : null });
      }}
    />
  );
};

FormView.propTypes = {
  updateEntry: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  createEntry: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object
};

export default FormView;
