import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;

const RenderDate = ({ input: { value, onChange, ...inputRest }, label, meta: { touched, error } }) => {
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
    <FormItem label={label} validateStatus={validateStatus} help={touched && error}>
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
  meta: PropTypes.object
};

export default RenderDate;
