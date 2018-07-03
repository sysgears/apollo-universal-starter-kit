import React from 'react';
import PropTypes from 'prop-types';
import { pascalize } from 'humps';
import { View } from 'react-native';
import { RenderSelect } from './index';
import schemaQueries from '../../../../generatedContainers';

const handleSelect = (selectedValue, edges, onChangeValue) => {
  let selectedItem = edges && Array.isArray(edges) ? edges.find(item => item.value == selectedValue) : '';
  onChangeValue(selectedItem ? { id: selectedItem.value } : '');
};

const RenderSelectQuery = ({
  input: { name },
  label,
  schema,
  customStyles,
  onChange: onChangeValue,
  value,
  ...props
}) => {
  const pascalizeSchemaName = pascalize(schema.name);
  const formatedValue = value && value != '' && typeof value !== 'undefined' ? value.id : '0';
  const defaultOption = { label: 'Select Item', value: '0' };
  const Query = schemaQueries[`${pascalizeSchemaName}Query`];

  let defaultStyle = {
    container: {
      paddingLeft: 0
    },
    itemContainer: {},
    itemTitle: {},
    itemAction: {
      flexDirection: 'column',
      flex: 2,
      justifyContent: 'center',
      alignItems: 'flex-end'
    }
  };
  if (customStyles) {
    defaultStyle = customStyles;
  }

  return (
    <Query limit={10}>
      {({ loading, data }) => {
        if (!loading || data) {
          let computedData = null;
          if (Array.isArray(data.edges) && data.edges.length > 0) {
            computedData = data.edges.map(item => {
              return { label: item.name, value: item.id };
            });
            if (!value) {
              computedData.push(defaultOption);
            }
          }

          let computedProps = {
            renderSelectStyles: defaultStyle,
            value: formatedValue,
            data: computedData,
            name,
            onChange: selectedValue => handleSelect(selectedValue, computedData, onChangeValue),
            ...props
          };
          return <RenderSelect {...computedProps} />;
        } else {
          return <View />;
        }
      }}
    </Query>
  );
};

RenderSelectQuery.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  schema: PropTypes.object,
  customStyles: PropTypes.object,
  formType: PropTypes.string,
  onChange: PropTypes.any,
  value: PropTypes.any
};

export default RenderSelectQuery;
