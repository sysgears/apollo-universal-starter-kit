import React from 'react';
import PropTypes from 'prop-types';
import { onSubmit } from '../../../../utils/crud';
import generateFormik from '../../generateFormik';

const FormView = ({ schema, updateEntry, createEntry, title, data }) => {
  const Formik = generateFormik(schema);
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
