import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';
import { FormItem, Input } from './index';

export default class RenderTextArea extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    hasTypeOf: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  render() {
    const {
      input,
      label,
      formItemLayout,
      meta: { touched, error }
    } = this.props;

    let valid = true;
    if (touched && error) {
      valid = false;
    }

    return (
      <FormItem label={label} {...formItemLayout}>
        <div>
          <Input {...input} type="textarea" placeholder={label} invalid={!valid} autosize />
        </div>
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </FormItem>
    );
  }
}
