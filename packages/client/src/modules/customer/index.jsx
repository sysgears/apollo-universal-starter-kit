import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import CustomerList from './containers/CustomerList';
import CustomerEdit from './containers/CustomerEdit';
import reducers from './reducers';

import Feature from '../connector';

class CustomerListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Customer list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('CustomerEdit', { id: 0 })} />
  });
  render() {
    return <CustomerList navigation={this.props.navigation} />;
  }
}

CustomerListScreen.propTypes = {
  navigation: PropTypes.object
};

class CustomerEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} Customer`
  });
  render() {
    return <CustomerEdit navigation={this.props.navigation} />;
  }
}

CustomerEditScreen.propTypes = {
  navigation: PropTypes.object
};

const CustomerNavigator = StackNavigator({
  CustomerList: { screen: CustomerListScreen },
  CustomerEdit: { screen: CustomerEditScreen }
});

export default new Feature({
  tabItem: {
    Customer: {
      screen: CustomerNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { customer: reducers }
});
