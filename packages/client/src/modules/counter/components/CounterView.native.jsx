import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import translate from '../../../i18n';
import { Button, primary, Loading } from '../../common/components/native';

const CounterView = ({
  loading,
  counter,
  addCounter,
  reduxCount,
  onReduxIncrement,
  counterState,
  addCounterState,
  t
}) => {
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
        <View>
          <View style={styles.element}>
            <Text style={styles.box}>{t('apolloCount.text', { counterState })}</Text>
          </View>
          <Button type={primary} onPress={addCounterState(1)}>
            {t('apolloCount.btnLabel')}
          </Button>
        </View>
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
  counterState: PropTypes.number.isRequired,
  addCounterState: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('counter')(CounterView);
