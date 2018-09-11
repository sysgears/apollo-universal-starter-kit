/*tslint:disable:no-implicit-dependencies*/
import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { IconButton } from '../common/components/native';
import $Module$ from './containers/$Module$';
import Feature from '../connector.native';

export default new Feature({
  drawerItem: {
    $Module$: {
      screen: createStackNavigator({
        $Module$: {
          screen: $Module$,
          navigationOptions: ({ navigation }: any) => ({
            headerTitle: `$Module$`,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            ),
            headerStyle: { backgroundColor: '#fff' }
          })
        }
      }),
      navigationOptions: {
        drawerLabel: `$Module$`
      }
    }
  }
});
