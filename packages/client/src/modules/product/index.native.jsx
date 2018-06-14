import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import ProductList from './containers/ProductList';
import ProductEdit from './containers/ProductEdit';
import resolvers from './resolvers';

import Feature from '../connector';

class ProductListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Product list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('ProductEdit', { id: 0 })} />
  });
  render() {
    return <ProductList navigation={this.props.navigation} title="Product" nativeLink={'ProductEdit'} />;
  }
}

ProductListScreen.propTypes = {
  navigation: PropTypes.object
};

class ProductEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} Product`
  });
  render() {
    return <ProductEdit navigation={this.props.navigation} title="Product" />;
  }
}

ProductEditScreen.propTypes = {
  navigation: PropTypes.object
};

const ProductNavigator = createStackNavigator({
  ProductList: { screen: ProductListScreen },
  ProductEdit: { screen: ProductEditScreen }
});

export default new Feature({
  drawerItem: {
    Product: {
      screen: ProductNavigator,
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
