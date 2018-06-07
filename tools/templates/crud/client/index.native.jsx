import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import $Module$List from './containers/$Module$List';
import $Module$Edit from './containers/$Module$Edit';
import resolvers from './resolvers';

import Feature from '../connector';

class $Module$ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '$Module$ list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('$Module$Edit', { id: 0 })} />
  });
  render() {
    return <$Module$List navigation={this.props.navigation} title="$MoDuLe$" nativeLink={"$MoDuLe$Edit"} />;
  }
}

$Module$ListScreen.propTypes = {
  navigation: PropTypes.object
};

class $Module$EditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} $MoDuLe$`
  });
  render() {
    return <$Module$Edit navigation={this.props.navigation} title="$MoDuLe$" />;
  }
}

$Module$EditScreen.propTypes = {
  navigation: PropTypes.object
};

const $Module$Navigator = createStackNavigator({
  $Module$List: { screen: $Module$ListScreen },
  $Module$Edit: { screen: $Module$EditScreen }
});

export default new Feature({
  drawerItem: {
    $Module$: {
      screen: $Module$Navigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      },
      userInfo: {
        showOnLogin: true
      }
    }
  },
  resolver: resolvers
});
