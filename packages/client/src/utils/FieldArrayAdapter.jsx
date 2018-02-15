import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FieldArrayAdapter extends Component {
  static contextTypes = {
    formik: PropTypes.object
  };

  static propTypes = {
    component: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    if (!context.formik) {
      throw new Error('FieldArray must be inside a component decorated with formik()');
    }
  }

  render() {
    const { component } = this.props;

    return React.createElement(component, {
      ...this.props
    });
  }
}
