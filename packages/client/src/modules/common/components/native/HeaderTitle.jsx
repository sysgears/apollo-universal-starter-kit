import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, Platform } from 'react-native';

const HeaderTitle = ({ t, i18nKey, style, children, ...props }) => (
  <Text {...props} style={typeof style === 'string' ? styles[style] : style || styles.menuTitle}>
    {t ? t(i18nKey || 'navLink') : children}
  </Text>
);

HeaderTitle.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  i18nKey: PropTypes.string,
  style: PropTypes.any
};

const styles = StyleSheet.create({
  menuTitle: {
    padding: 16,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16
  }
});

export default HeaderTitle;
