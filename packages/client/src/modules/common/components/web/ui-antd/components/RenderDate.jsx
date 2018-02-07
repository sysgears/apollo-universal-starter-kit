import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
import { FormItem } from './index';

const dateFormat = 'YYYY-MM-DD';

const RenderDate = ({ input: { value, onChange, ...inputRest }, label, formItemLayout, meta: { touched, error } }) => {
  let validateStatus = '';
  if (touched && error) {
    validateStatus = 'error';
  }
  if (value !== '') {
    value = moment(value, dateFormat);
  } else {
    value = null;
  }

  return (
    <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
      <div>
        <DatePicker
          value={value}
          format={dateFormat}
          onChange={(date, dateString) => onChange(dateString)}
          {...inputRest}
        />
      </div>
    </FormItem>
  );
};

RenderDate.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  formItemLayout: PropTypes.object,
  meta: PropTypes.object
};

export default RenderDate;
