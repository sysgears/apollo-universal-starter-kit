import { AppLoading, registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { View } from 'react-native';
import ClientModule from '@gqlapp/module-client-react-native';

import App from './App';

interface AwakeInDevAppProps {
  exp: any;
  modules: ClientModule;
}

interface AwakeInDevAppState {
  isReady: boolean;
}

export default async (modules: ClientModule) => {
  // we don't want this to require transformation
  class AwakeInDevApp extends React.Component<AwakeInDevAppProps, AwakeInDevAppState> {
    constructor(props: AwakeInDevAppProps) {
      super(props);
      this.state = { isReady: false };
    }

    public async componentDidMount() {
      await Font.loadAsync({
        Roboto: require('../../../node_modules/native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('../../../node_modules/native-base/Fonts/Roboto_medium.ttf'),
        Ionicons: require('../../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf')
      });

      this.setState({ isReady: true });
    }

    public render() {
      if (!this.state.isReady) {
        return <AppLoading startAsync={null} onError={null} onFinish={null} />;
      }

      return React.createElement(
        View,
        {
          style: {
            flex: 1,
            marginTop: Constants.statusBarHeight
          }
        },
        React.createElement(App, { ...this.props, modules }),
        React.createElement(View)
      );
    }

    public _activate() {
      if (process.env.NODE_ENV === 'development') {
        activateKeepAwake();
      }
    }

    public _deactivate() {
      if (process.env.NODE_ENV === 'development') {
        deactivateKeepAwake();
      }
    }
  }

  registerRootComponent(AwakeInDevApp);
};
