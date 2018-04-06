import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CardItem, CardText, CardSubtitleText, Button } from '../../common/components/native';

export default class CancelSubscriptionView extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    active: PropTypes.bool,
    cancel: PropTypes.func.isRequired
  };

  state = {
    cancelling: false,
    errors: null
  };

  onClick = async () => {
    this.setState({ cancelling: true });
    const { errors } = await this.props.cancel();

    if (errors) {
      this.setState({
        cancelling: false,
        errors
      });
    }
  };

  render() {
    const { loading, active } = this.props;
    const { errors } = this.state;

    if (loading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <CardItem>
          <CardSubtitleText>Subscription</CardSubtitleText>
        </CardItem>
        <View style={styles.buttonWrapper}>
          {active && (
            <Button onPress={this.onClick} disabled={this.state.cancelling} danger>
              Cancel Subscription
            </Button>
          )}
          {!active && (
            <View>
              <CardText>You do not have a subscription.</CardText>
            </View>
          )}
          {errors && (
            <View style={styles.alertWrapper}>
              <View style={styles.alertIconWrapper}>
                <FontAwesome name="exclamation-circle" size={20} style={{ color: '#c22' }} />
              </View>
              <View style={styles.alertTextWrapper}>
                <Text style={styles.alertText}>{errors}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

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
    paddingHorizontal: 10
  }
});
