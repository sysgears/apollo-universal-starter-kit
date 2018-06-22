import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import countries from '../../../../../../../../common/ISOCountries';
import { FormItem } from './index';

const Option = Select.Option;

export default class RenderSelectCountry extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object,
    style: PropTypes.object,
    formType: PropTypes.string.isRequired
  };

  handleChange = value => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    setFieldValue(name, value);
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
      style,
      formItemLayout,
      meta: { touched, error },
      formType
    } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    const options = [];
    Object.entries(countries).forEach(([key, value]) =>
      options.push(
        <Option key={key} value={key}>
          {value}
        </Option>
      )
    );

    let defaultStyle = { width: '100%' };
    if (style) {
      defaultStyle = style;
    }

    let defaultValue = 'defaultValue';
    if (formType === 'filter') {
      defaultValue = 'value';
    }

    let props = {
      allowClear: formType !== 'form' ? true : false,
      showSearch: true,
      dropdownMatchSelectWidth: false,
      style: defaultStyle,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      ...inputRest,
      [defaultValue]: value,
      optionFilterProp: 'children',
      filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={error}>
        <div>
          <Select {...props}>{options}</Select>
        </div>
      </FormItem>
    );
  }
}
