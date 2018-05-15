import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import ClientCounter from '../clientCounter';
import translate from '../../../i18n';
import { Button, primary, Loading } from '../../common/components/native';

const CounterView = ({ loading, counter, addCounter, reduxCount, onReduxIncrement, t }) => {
  if (loading) {
    return <Loading text={t('loading')} />;
  } else {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.element}>
            <Text style={styles.box}>{t('counter.text', { counter })}</Text>
          </View>
          <Button type={primary} onPress={addCounter(1)}>
            {t('counter.btnLabel')}
          </Button>
        </View>
        <View>
          <View style={styles.element}>
            <Text style={styles.box}>{t('reduxCount.text', { reduxCount })}</Text>
          </View>
          <Button type={primary} onPress={onReduxIncrement(1)}>
            {t('reduxCount.btnLabel')}
          </Button>
        </View>
        <ClientCounter t={t} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginBottom: 5
  }
});

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  addCounter: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('counter')(CounterView);
