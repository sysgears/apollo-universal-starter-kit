import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar as SearchBarComponent } from 'antd-mobile';

const SearchBar = ({ onChange, onChangeText, ...props }) => {
  return <SearchBarComponent onChange={onChangeText || onChange} {...props} cancelText=" " />;
};

SearchBar.propTypes = {
  onChange: PropTypes.func,
  onChangeText: PropTypes.func
};

export default SearchBar;
