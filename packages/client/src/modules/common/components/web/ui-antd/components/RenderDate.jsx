import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import { FormItem } from './index';

const dateFormat = 'YYYY-MM-DD';

export default class RenderDate extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object
  };

  handleChange = (date, dateString) => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    //console.log('RenderDate: handleChange');
    //console.log('name:', name);
    //console.log('dateString:', dateString);
    setFieldValue(name, dateString);
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
      input: { value, onChange, onBlur, ...inputRest },
      label,
      formItemLayout,
      meta: { touched, error }
    } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    let formatedValue = value;
    if (value !== null && value !== undefined && value !== '') {
      formatedValue = moment(value, dateFormat);
    } else {
      formatedValue = null;
    }
    //console.log('value:', value);
    //console.log('typeof value:', typeof value);
    //console.log('formatedValue:', formatedValue);
    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <DatePicker
            value={formatedValue}
            format={dateFormat}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            {...inputRest}
          />
        </div>
      </FormItem>
    );
  }
}
