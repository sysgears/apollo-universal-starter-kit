import * as Expo from 'expo';
import React from 'react';
import { View } from 'react-native';
import App from './App';
import ClientModule from '@gqlapp/module-client-react-native';

interface AwakeInDevAppProps {
  exp: any;
  modules: ClientModule;
}

interface AwakeInDevAppState {
  isReady: boolean;
}

export default (modules: ClientModule) => {
  // we don't want this to require transformation
  class AwakeInDevApp extends React.Component<AwakeInDevAppProps, AwakeInDevAppState> {
    constructor(props: AwakeInDevAppProps) {
      super(props);
      this.state = { isReady: false };
    }

    public async componentDidMount() {
      await Expo.Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
      });

      this.setState({ isReady: true });
    }

    public render() {
      if (!this.state.isReady) {
        return <Expo.AppLoading startAsync={null} onError={null} onFinish={null} />;
      }

      return React.createElement(
        View,
        {
          style: {
            flex: 1,
            marginTop: Expo.Constants.statusBarHeight
          }
        },
        React.createElement(App, { ...this.props, modules }),
        React.createElement(process.env.NODE_ENV === 'development' ? Expo.KeepAwake : View)
      );
    }
  }

  Expo.registerRootComponent(AwakeInDevApp);
};
