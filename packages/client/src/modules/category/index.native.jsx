import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import CategoryList from './containers/CategoryList';
import CategoryEdit from './containers/CategoryEdit';
import resolvers from './resolvers';

import Feature from '../connector';

class CategoryListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Category list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('CategoryEdit', { id: 0 })} />
  });
  render() {
    return <CategoryList navigation={this.props.navigation} title="Category" nativeLink={'CategoryEdit'} />;
  }
}

CategoryListScreen.propTypes = {
  navigation: PropTypes.object
};

class CategoryEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} Category`
  });
  render() {
    return <CategoryEdit navigation={this.props.navigation} title="Category" />;
  }
}

CategoryEditScreen.propTypes = {
  navigation: PropTypes.object
};

const CategoryNavigator = createStackNavigator({
  CategoryList: { screen: CategoryListScreen },
  CategoryEdit: { screen: CategoryEditScreen }
});

export default new Feature({
  drawerItem: {
    Category: {
      screen: CategoryNavigator,
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
