import React from 'react';
import PropTypes from 'prop-types';
import ADSearchBar from 'antd-mobile/lib/search-bar';

const SearchBar = ({ onChange, onChangeText, ...props }) => {
  return <ADSearchBar onChange={onChangeText || onChange} {...props} cancelText=" " />;
};

SearchBar.propTypes = {
  onChange: PropTypes.func,
  onChangeText: PropTypes.func
};

export default SearchBar;
