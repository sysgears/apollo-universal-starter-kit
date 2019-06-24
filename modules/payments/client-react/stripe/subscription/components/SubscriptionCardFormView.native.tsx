import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { Button, primary } from '@gqlapp/look-client-react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SubscriptionCardFormViewProps {
  submitting: boolean;
  buttonName: string;
  onSubmit: (subscriptionInput: any, stripe?: any) => void;
  error: string | null;
}

const SubscriptionCardFormView = ({ onSubmit, submitting, buttonName, error }: SubscriptionCardFormViewProps) => {
  const [cardInfo, setCardInfo] = useState({ valid: false });

  return (
    <View>
      <View>
        <CreditCardInput requiresName onChange={(data: any) => setCardInfo(data)} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button color={primary} disabled={!cardInfo.valid || submitting} onClick={() => onSubmit(cardInfo)}>
          {buttonName}
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
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    padding: 10,
    zIndex: 100
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
  }
});

export default SubscriptionCardFormView;
