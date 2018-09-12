import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';

import { Button, primary } from '../../../../common/components/native';

interface SubscriptionCardFormViewProps {
  submitting: boolean;
  buttonName: string;
  onSubmit: (subscriptionInput: any, stripe?: any) => void;
}

// TODO: translate
export default class SubscriptionCardFormView extends React.Component<SubscriptionCardFormViewProps, any> {
  constructor(props: SubscriptionCardFormViewProps) {
    super(props);
    this.state = { cardInfo: { valid: false } };
  }

  public render() {
    const { onSubmit, submitting, buttonName } = this.props;

    return (
      <View>
        <View>
          <CreditCardInput requiresName onChange={(cardInfo: any) => this.setState({ cardInfo })} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            color={primary}
            disabled={!this.state.cardInfo.valid || submitting}
            onClick={() => onSubmit(this.state.cardInfo)}
          >
            {buttonName}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    padding: 10,
    zIndex: 100
  }
});
