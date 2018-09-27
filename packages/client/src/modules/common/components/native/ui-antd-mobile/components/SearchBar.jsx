import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar as ADSearchBar } from 'antd-mobile-rn';

const SearchBar = ({ onChange, onChangeText, ...props }) => {
  return <ADSearchBar onChange={onChangeText || onChange} {...props} cancelText=" " />;
};

SearchBar.propTypes = {
  onChange: PropTypes.func,
  onChangeText: PropTypes.func
};

export default SearchBar;
