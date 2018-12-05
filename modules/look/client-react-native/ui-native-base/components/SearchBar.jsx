import React from 'react';
import PropTypes from 'prop-types';
import { Item, Input, Icon } from 'native-base';
import { placeholderColor } from '../../styles';

const SearchBar = ({ onChange, onChangeText, ...props }) => {
  return (
    <Item>
      <Icon name="ios-search" />
      <Input
        placeholderTextColor={placeholderColor}
        placeholder="Search"
        onChangeText={onChangeText || onChange}
        {...props}
      />
    </Item>
  );
};

SearchBar.propTypes = {
  onChange: PropTypes.func,
  onChangeText: PropTypes.func
};

export default SearchBar;
