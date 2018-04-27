import React from 'react';
//eslint-disable-next-line import/no-extraneous-dependencies
import { DomainSchemaFormik } from '@domain-schema/formik';
import { RenderField, RenderCheckBox, RenderSelect } from './components/web';

import Feature from '../connector';

DomainSchemaFormik.setFieldComponents({
  input: RenderField,
  select: RenderSelect,
  checkbox: RenderCheckBox
});

const Forms = props => props.children;

export default new Feature({
  // eslint-disable-next-line react/display-name
  rootComponentFactory: () => <Forms />
});
