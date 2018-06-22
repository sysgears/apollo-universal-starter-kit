import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { DebounceInput } from 'react-debounce-input';

import { hasRole } from '../../../user/containers/Auth';
import { Form, FormItem, Input, Row, Col, Button, Icon } from '../web';
import { createFormFields } from '../../util';
import { mapFormPropsToValues, pickInputFields } from '../../../../utils/crud';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

class FilterView extends React.PureComponent {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    searchText: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    customFields: PropTypes.object,
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool
  };

  state = {
    expand: false
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleSearch = e => {
    const { onFilterChange } = this.props;
    onFilterChange({ searchText: e.target.value });
  };

  render() {
    const { schema, onFilterChange, customFields, currentUser } = this.props;
    const { expand } = this.state;

    const showFilter =
      customFields === null
        ? false
        : customFields && customFields.role
          ? !!hasRole(customFields.role, currentUser)
          : true;

    if (!showFilter) {
      return null;
    }

    return (
      <Formik
        initialValues={mapFormPropsToValues({ schema, formType: 'filter' })}
        onSubmit={values => {
          onFilterChange(pickInputFields({ schema, values, formType: 'filter' }));
        }}
        onReset={(values, formikBag) => {
          formikBag.resetForm();
          onFilterChange({});
        }}
        render={({ values, handleChange, handleBlur, handleSubmit, handleReset }) => (
          <Form className="ant-advanced-search-form bootstrap-advanced-search-form" onSubmit={handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem label="Find" {...formItemLayout}>
                  <DebounceInput
                    minLength={2}
                    debounceTimeout={300}
                    placeholder="Search ..."
                    element={Input}
                    onChange={this.handleSearch}
                  />
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  Clear
                </Button>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                  Advanced{' '}
                  <Icon
                    type={this.state.expand ? 'up' : 'down'}
                    className={this.state.expand ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}
                  />
                </a>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: expand ? 'block' : 'none' }}>
              {createFormFields({
                handleChange,
                handleBlur,
                schema,
                values,
                formItemLayout,
                prefix: '',
                customFields,
                formType: 'filter'
              })}
            </Row>
          </Form>
        )}
      />
    );
  }
}

export default FilterView;
