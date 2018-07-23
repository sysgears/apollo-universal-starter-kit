import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';
import { FormItem, InputNumber } from './index';

export default class RenderNumber extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    hasTypeOf: PropTypes.func,
    meta: PropTypes.object
  };

  render() {
    const {
      input,
      label,
      formItemLayout,
      placeholder,
      meta: { touched, error }
    } = this.props;

    return (
      <FormItem label={label} {...formItemLayout}>
        <div>
          <InputNumber {...input} placeholder={label || placeholder} invalid={!!(touched && error)} />
          {touched && (error && <FormFeedback>{error}</FormFeedback>)}
        </div>
      </FormItem>
    );
  }
}
