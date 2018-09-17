import React from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from 'react-native';

import SubscriptionCardForm from './SubscriptionCardFormView';
import { TranslateFunction } from '../../../../../i18n';
import { CreditCardInput } from '../types';
import settings from '../../../../../../../../settings';

interface AddSubscriptionViewProps {
  t: TranslateFunction;
  submitting: boolean;
  onSubmit: (subscriptionInput: CreditCardInput, stripe: any) => void;
  error: string | null;
}

export default (props: AddSubscriptionViewProps) => {
  const { t } = props;

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={styles.scrollView}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.textWrapper}>
          <Text style={styles.infoText}>{t('add.description')}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.infoText}>{t('add.product')}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.infoText}>
            {t('add.price')} {settings.payments.stripe.recurring.plan.amount / 100}
          </Text>
        </View>
        <View style={styles.cardFormWrapper}>
          <SubscriptionCardForm {...props} buttonName={t('add.btn')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  scrollView: {
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
