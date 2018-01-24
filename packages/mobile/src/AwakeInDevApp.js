import Expo from 'expo';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import App from './App';

// we don't want this to require transformation
class AwakeInDevApp extends React.Component {
  static propTypes = {
    exp: PropTypes.object
  };
  state = {
    isReady: false
  };

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

    return React.createElement(
      View,
      {
        style: {
          flex: 1
        }
      },
      React.createElement(App, { expUri: this.props.exp ? this.props.exp.initialUri : null }),
      React.createElement(process.env.NODE_ENV === 'development' ? Expo.KeepAwake : View)
    );
  }
}

Expo.registerRootComponent(AwakeInDevApp);
