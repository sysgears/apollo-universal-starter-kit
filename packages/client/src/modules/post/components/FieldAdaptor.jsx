import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FieldAdapter extends Component {
  static contextTypes = {
    formik: PropTypes.object
  };

  static propTypes = {
    component: PropTypes.func,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    if (!context.formik) {
      throw new Error('Field must be inside a component decorated with formik()');
    }
  }

  render() {
    const { formik } = this.context;
    const { component, name, value } = this.props;

    const meta = {
      touched: formik.touched[name],
      error: formik.errors[name]
    };

    const input = {
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      name,
      value
    };

    return React.createElement(component, {
      ...this.props,
      input,
      meta
    });
  }
}
