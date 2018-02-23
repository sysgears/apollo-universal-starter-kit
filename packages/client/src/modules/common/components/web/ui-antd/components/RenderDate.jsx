import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
import { FormItem } from './index';

const dateFormat = 'YYYY-MM-DD';

export default class RenderDate extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object
  };

  handleChange = (date, dateString) => {
    const { input: { onChange, name } } = this.props;
    //console.log('RenderDate: handleChange');
    //console.log('name:', name);
    //console.log('dateString:', dateString);
    onChange(name, dateString);
  };

  render() {
    const { input: { value, onChange, ...inputRest }, label, formItemLayout, meta: { touched, error } } = this.props;

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
          <DatePicker value={formatedValue} format={dateFormat} onChange={this.handleChange} {...inputRest} />
        </div>
      </FormItem>
    );
  }
}
