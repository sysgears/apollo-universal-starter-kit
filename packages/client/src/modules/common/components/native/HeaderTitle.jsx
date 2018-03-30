import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const HeaderTitle = ({ t, i18nKey, style }) => <Text style={style || styles.menuTitle}>{t(i18nKey || 'navLink')}</Text>;

HeaderTitle.propTypes = {
  t: PropTypes.func.isRequired,
  i18nKey: PropTypes.string,
  style: PropTypes.any
};

const styles = StyleSheet.create({
  menuTitle: {
    color: 'white'
  }
});

export default HeaderTitle;
