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
    hasTypeOf: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  handleChange = e => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    setFieldValue(name, e.target.value);
  };

  handleBlur = () => {
    const {
      input: { name },
      setFieldTouched
    } = this.props;
    setFieldTouched(name, true);
  };

  render() {
    const {
      input: { onChange, onBlur, ...inputRest },
      label,
      formItemLayout,
      placeholder,
      meta: { touched, error }
    } = this.props;

    let valid = true;
    if (touched && error) {
      valid = false;
    }

    return (
      <FormItem label={label} {...formItemLayout}>
        <div>
          <InputNumber
            {...inputRest}
            placeholder={label || placeholder}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            invalid={!valid}
          />
          {touched && (error && <FormFeedback>{error}</FormFeedback>)}
        </div>
      </FormItem>
    );
  }
}
