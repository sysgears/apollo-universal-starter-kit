import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import translate from '../../../i18n';
import { ClientCounter } from '../clientCounter';
import { ReduxCounter } from '../reduxCounter';
import { ServerCounter } from '../serverCounter';

class Counter extends React.Component {
  static propTypes = {
    t: PropTypes.func
  };

  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <ServerCounter t={t} />
        <ReduxCounter t={t} />
        <ClientCounter t={t} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 15
  }
});

export default translate('counter')(Counter);
