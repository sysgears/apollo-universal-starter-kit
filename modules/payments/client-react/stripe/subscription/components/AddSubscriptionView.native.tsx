import React, { useRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import settings from '@gqlapp/config';

import SubscriptionCardForm from './SubscriptionCardFormView';
import { CreditCardInput } from '../types';

interface AddSubscriptionViewProps {
  t: TranslateFunction;
  submitting: boolean;
  onSubmit: (subscriptionInput: CreditCardInput, stripe: any) => void;
  error: string | null;
}

const AddSubscriptionView = (props: AddSubscriptionViewProps) => {
  const { t } = props;
  const ref = useRef(null);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} ref={ref}>
        <View style={styles.textWrapper}>
          <Text style={styles.infoText}>{t('add.description')}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.infoText}>{t('add.product')}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.infoText}>
            {t('add.price')} {settings.stripe.subscription.plan.amount / 100}
          </Text>
        </View>
        <View style={styles.cardFormWrapper}>
          <SubscriptionCardForm {...props} buttonName={t('add.btn')} />
        </View>
      </ScrollView>
      <KeyboardSpacer
        onToggle={() => {
          /**
           * This functionality demonstrates how to prevent covering the inputs when the keyboard pops up.
           * Main scroll container is carolling down after popping up the keyboard.
           */
          setTimeout(() => ref.current.scrollToEnd({ animated: true }), 0);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textWrapper: {
    margin: 10
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center'
  },
  cardFormWrapper: {
    padding: 10,
    margin: 10
  }
});

export default AddSubscriptionView;
