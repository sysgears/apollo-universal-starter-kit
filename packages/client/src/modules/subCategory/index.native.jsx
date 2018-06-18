import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import SubCategoryList from './containers/SubCategoryList';
import SubCategoryEdit from './containers/SubCategoryEdit';
import resolvers from './resolvers';

import Feature from '../connector';

class SubCategoryListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'SubCategory list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('SubCategoryEdit', { id: 0 })} />
  });
  render() {
    return <SubCategoryList navigation={this.props.navigation} title="Sub Category" nativeLink={'Sub CategoryEdit'} />;
  }
}

SubCategoryListScreen.propTypes = {
  navigation: PropTypes.object
};

class SubCategoryEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} Sub Category`
  });
  render() {
    return <SubCategoryEdit navigation={this.props.navigation} title="Sub Category" />;
  }
}

SubCategoryEditScreen.propTypes = {
  navigation: PropTypes.object
};

const SubCategoryNavigator = createStackNavigator({
  SubCategoryList: { screen: SubCategoryListScreen },
  SubCategoryEdit: { screen: SubCategoryEditScreen }
});

export default new Feature({
  drawerItem: {
    SubCategory: {
      screen: SubCategoryNavigator,
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
