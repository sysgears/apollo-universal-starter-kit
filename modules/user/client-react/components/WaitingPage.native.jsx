import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { translate } from '@module/i18n-client-react';

import { compose } from 'react-apollo';

class Waiting extends React.PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    const { t } = this.props;

    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>
          {t('mobile.waiting')}
          ...
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  text: {
    paddingLeft: 10
  }
});
export default compose(translate('user'))(Waiting);
