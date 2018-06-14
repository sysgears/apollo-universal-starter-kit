import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import ProductTypeList from './containers/ProductTypeList';
import ProductTypeEdit from './containers/ProductTypeEdit';
import resolvers from './resolvers';

import Feature from '../connector';

class ProductTypeListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'ProductType list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('ProductTypeEdit', { id: 0 })} />
  });
  render() {
    return <ProductTypeList navigation={this.props.navigation} title="Product Type" nativeLink={'Product TypeEdit'} />;
  }
}

ProductTypeListScreen.propTypes = {
  navigation: PropTypes.object
};

class ProductTypeEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} Product Type`
  });
  render() {
    return <ProductTypeEdit navigation={this.props.navigation} title="Product Type" />;
  }
}

ProductTypeEditScreen.propTypes = {
  navigation: PropTypes.object
};

const ProductTypeNavigator = createStackNavigator({
  ProductTypeList: { screen: ProductTypeListScreen },
  ProductTypeEdit: { screen: ProductTypeEditScreen }
});

export default new Feature({
  drawerItem: {
    ProductType: {
      screen: ProductTypeNavigator,
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
