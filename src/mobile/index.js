import Expo from 'expo';
import React from 'react';
import { View } from 'react-native';

const App = () => {
  return React.createElement('div', null, 'Hello, from React Native!');
};

// we don't want this to require transformation
class AwakeInDevApp extends React.Component {
  render() {
    return React.createElement(
      View,
      {
        style: {
          flex: 1,
        },
      },
      React.createElement(App),
      React.createElement(process.env.NODE_ENV === 'development' ? Expo.KeepAwake : View)
    );
  }
}

Expo.registerRootComponent(AwakeInDevApp);
