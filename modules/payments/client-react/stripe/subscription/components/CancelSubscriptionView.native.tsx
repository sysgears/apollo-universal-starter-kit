import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '@gqlapp/look-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

interface CancelSubscriptionViewProps {
  onClick: () => void;
  error: string | null;
  submitting: boolean;
  t: TranslateFunction;
}

export default ({ t, onClick, error, submitting }: CancelSubscriptionViewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button onPress={onClick} disabled={submitting} danger>
          {t('cancel.btn')}
        </Button>
        {error && (
          <View style={styles.alertWrapper}>
            <View style={styles.alertIconWrapper}>
              <FontAwesome name="exclamation-circle" size={20} style={{ color: '#c22' }} />
            </View>
            <View style={styles.alertTextWrapper}>
              <Text style={styles.alertText}>{error}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  alertTextWrapper: {
    flex: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertIconWrapper: {
    padding: 5,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertText: {
    color: '#c22',
    fontSize: 16,
    fontWeight: '400'
  },
  alertWrapper: {
    backgroundColor: '#ecb7b7',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 10
  },
  buttonWrapper: {
    padding: 10
  }
});
