import React from 'react';
import PropTypes from 'prop-types';
import { pascalize } from 'humps';
import { FormItem, Select } from './index';
import schemaQueries from '../../../../commonGraphql';

export default class RenderSelectQuery extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object,
    schema: PropTypes.object,
    style: PropTypes.object,
    formType: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    searchText: '',
    dirty: false
  };

  handleChange = (e, edges) => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    let selectedItem = edges && Array.isArray(edges) ? edges.find(item => item.id == e.target.value) : '';
    setFieldValue(name, selectedItem ? selectedItem : '');
  };

  handleBlur = () => {
    const {
      input: { name },
      setFieldTouched
    } = this.props;
    setFieldTouched(name, true);
  };

  search = value => {
    const { dirty } = this.state;
    if ((value && value.length >= 1) || dirty) {
      this.setState({ searchText: value, dirty: true });
    }
  };

  render() {
    const {
      input: { value, onChange, onBlur, ...inputRest },
      label,
      schema,
      style,
      formItemLayout,
      meta: { touched, error }
    } = this.props;
    const { searchText } = this.state;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    const pascalizeSchemaName = pascalize(schema.name);
    let orderBy = null;
    for (const remoteKey of schema.keys()) {
      if (remoteKey === 'rank') {
        orderBy = {
          column: 'rank'
        };
      }
    }
    let formatedValue = value && value != '' && typeof value !== 'undefined' ? value.id : '';

    const Query = schemaQueries[`${pascalizeSchemaName}Query`];

    let defaultStyle = { width: '100%' };
    if (style) {
      defaultStyle = style;
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={error}>
        <div>
          <Query limit={10} filter={{ searchText }} orderBy={orderBy}>
            {({ loading, data }) => {
              if (!loading || data) {
                let options = data.edges
                  ? data.edges.map(opt => (
                      <option key={opt.id} value={opt.id.toString()} label={opt.name}>
                        {opt.name}
                      </option>
                    ))
                  : null;
                if (!value && data.edges && data.edges.length > 0) {
                  options.unshift(
                    <option key="0" value="0">
                      Select Item
                    </option>
                  );
                }

                let props = {
                  style: defaultStyle,
                  value: formatedValue,
                  onChange: e => this.handleChange(e, data.edges ? data.edges : null),
                  onBlur: this.handleBlur,
                  ...inputRest
                };
                return (
                  <Select type="select" {...props}>
                    {options}
                  </Select>
                );
              } else {
                return <div>Loading...</div>;
              }
            }}
          </Query>
        </div>
      </FormItem>
    );
  }
}
