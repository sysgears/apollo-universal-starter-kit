import React from 'react';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';
import { Button, Form, RenderField, RenderCheckBox, RenderSelect } from './components/web';

import Feature from '../connector';

DomainSchemaFormik.setFormComponents({
  input: RenderField,
  select: RenderSelect,
  checkbox: RenderCheckBox,
  form: Form,
  button: Button
});

const FormsGenerator = props => props.children;

export default new Feature({
  // eslint-disable-next-line react/display-name
  rootComponentFactory: () => <FormsGenerator />
});
