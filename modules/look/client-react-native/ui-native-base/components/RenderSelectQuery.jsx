import React from 'react';
import PropTypes from 'prop-types';
import { pascalize } from 'humps';
import { View, Text, StyleSheet } from 'react-native';
import schemaQueries from '../../../client-react/generatedContainers';
import RenderSelect from './RenderSelect';
import InputItemStyles from '../styles/InputItem';

const LIMIT = 20;

const handleSelect = (selectedValue, edges, onChange) => {
  let selectedItem = edges && Array.isArray(edges) ? edges.find(item => item.value == selectedValue) : '';
  onChange(selectedItem ? selectedItem : '');
};

const RenderSelectQuery = ({
  input: { name },
  meta: { error },
  label,
  schema,
  customStyles,
  onChange,
  value,
  ...props
}) => {
  const pascalizeSchemaName = pascalize(schema.name);
  const formatedValue = value && value != '' && typeof value !== 'undefined' ? value.id : '0';
  const defaultOption = { label: 'Select Item', value: '0' };
  const Query = schemaQueries[`${pascalizeSchemaName}Query`];

  let defaultStyle = {
    container: {
      paddingLeft: 0,
      flex: 1
    },
    itemContainer: {
      flex: 1
    },
    itemTitle: {},
    itemAction: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  };

  if (customStyles) {
    defaultStyle = customStyles;
  }

  return (
    <Query limit={LIMIT}>
      {({ loading, data }) => {
        if (!loading || data) {
          let computedData = null;
          if (Array.isArray(data.edges) && data.edges.length > 0) {
            computedData = data.edges.map(item => {
              return { ...item, label: item.name, value: item.id };
            });
            if (formatedValue) {
              computedData.push(defaultOption);
            }
          }

          let computedProps = {
            ...props,
            renderSelectStyles: defaultStyle,
            value: formatedValue,
            data: computedData,
            name,
            error,
            onChange: selectedValue => handleSelect(selectedValue, computedData, onChange)
          };
          return (
            <View>
              <RenderSelect {...computedProps} />
              {!!error && (
                <View>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>
          );
        } else {
          return <View />;
        }
      }}
    </Query>
  );
};

const styles = StyleSheet.create(InputItemStyles);

RenderSelectQuery.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  schema: PropTypes.object,
  customStyles: PropTypes.object,
  formType: PropTypes.string,
  onChange: PropTypes.any,
  value: PropTypes.any,
  meta: PropTypes.object,
  error: PropTypes.string
};

export default RenderSelectQuery;
