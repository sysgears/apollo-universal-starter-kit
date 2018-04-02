import Expo, { Constants } from 'expo';
import React from 'react';
import { View } from 'react-native';
import App from './App';

interface AwakeInDevAppProps {
  exp: any;
}

interface AwakeInDevAppState {
  isReady: boolean;
}

// we don't want this to require transformation
class AwakeInDevApp extends React.Component<AwakeInDevAppProps, AwakeInDevAppState> {
  constructor(props: AwakeInDevAppProps) {
    super(props);
    this.state = { isReady: false };
  }

  public async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
    });

    this.setState({ isReady: true });
  }

  public render() {
    const appLoadingProps = {
      startAsync: () => Promise.resolve(),
      onFinish: () => {}
    };

    return !this.state.isReady ? (
      <Expo.AppLoading {...appLoadingProps} />
    ) : (
      React.createElement(
        View,
        {
          style: {
            flex: 1,
            marginTop: Constants.statusBarHeight
          }
        },
        React.createElement(App, this.props),
        React.createElement(process.env.NODE_ENV === 'development' ? Expo.KeepAwake : View)
      )
    );
  }
}

Expo.registerRootComponent(AwakeInDevApp);
