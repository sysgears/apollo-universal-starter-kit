import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ClientCounter from '../clientCounter/containers/ClientCounter';
import ServerCounter from '../serverCounter/containers/ServerCounter';
import ReduxCounter from '../reduxCounter/containers/ReduxCounter';
import translate from '../../../i18n';

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
