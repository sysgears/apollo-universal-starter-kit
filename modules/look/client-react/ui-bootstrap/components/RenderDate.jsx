import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormItem, DatePicker } from './index';

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

  handleChange = date => {
    const {
      input: { name },
      setFieldValue
    } = this.props;

    let computedDate = moment(date);
    if (computedDate.isValid()) {
      return setFieldValue(name, computedDate.format(dateFormat));
    }
    setFieldValue(name, moment().format(dateFormat));
  };

  render() {
    const {
      input: { value, onChange, ...inputRest },
      label,
      formItemLayout,
      meta: { touched, error }
    } = this.props;

    let formattedValue = value ? moment(value, dateFormat) : null;

    return (
      <FormItem label={label} {...formItemLayout} help={touched && error}>
        <div>
          <DatePicker value={formattedValue} dateFormat={dateFormat} onChange={this.handleChange} {...inputRest} />
        </div>
      </FormItem>
    );
  }
}
