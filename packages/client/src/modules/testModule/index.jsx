import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import TestModuleList from './containers/TestModuleList';
import TestModuleEdit from './containers/TestModuleEdit';
import resolvers from './resolvers';

import Feature from '../connector';

class TestModuleListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'TestModule list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('TestModuleEdit', { id: 0 })} />
  });
  render() {
    return <TestModuleList navigation={this.props.navigation} title="Test Module" />;
  }
}

TestModuleListScreen.propTypes = {
  navigation: PropTypes.object
};

class TestModuleEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} Test Module`
  });
  render() {
    return <TestModuleEdit navigation={this.props.navigation} />;
  }
}

TestModuleEditScreen.propTypes = {
  navigation: PropTypes.object
};

const TestModuleNavigator = StackNavigator({
  TestModuleList: { screen: TestModuleListScreen },
  TestModuleEdit: { screen: TestModuleEditScreen }
});

export default new Feature({
  tabItem: {
    TestModule: {
      screen: TestModuleNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  resolver: resolvers
});
