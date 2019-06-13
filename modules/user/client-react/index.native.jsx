import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';
import ClientModule from '@gqlapp/module-client-react-native';

import resolvers from './resolvers';
import resources from './locales';
import DataRootComponent from './containers/DataRootComponent';
import UserScreenNavigator from './containers/UserScreenNavigator';
import Profile from './containers/Profile';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import Logout from './containers/Logout';
import Register from './containers/Register';
import Users from './containers/Users';
import UserEdit from './containers/UserEdit';
import UserAdd from './containers/UserAdd';

export { default as CURRENT_USER_QUERY } from './graphql/CurrentUserQuery.graphql';

const AuthScreen = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <HeaderTitleWithI18n i18nKey="navLink.signIn" style="subTitle" />,
        headerLeft: (
          <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
        ),
        headerForceInset: {}
      })
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: () => ({
        headerTitle: <HeaderTitleWithI18n i18nKey="navLink.forgotPassword" style="subTitle" />,
        headerForceInset: {}
      })
    },
    Register: {
      screen: Register,
      navigationOptions: () => ({
        headerTitle: <HeaderTitleWithI18n i18nKey="navLink.register" style="subTitle" />,
        headerForceInset: {}
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: '#fff'
    },
    navigationOptions: {
      headerStyle: { backgroundColor: '#fff' }
    }
  }
);

const HeaderTitleWithI18n = translate('user')(HeaderTitle);

export * from './containers/Auth';

const ref = { navigator: null };

const MainScreenNavigator = () => {
  const Navigator = ref.navigator;
  return <Navigator />;
};

export default new ClientModule({
  drawerItem: [
    {
      Profile: {
        screen: createStackNavigator({
          Profile: {
            screen: Profile,
            navigationOptions: ({ navigation }) => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="navLink.profile" style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              ),
              headerForceInset: {}
            })
          },
          ProfileEdit: {
            screen: UserEdit,
            navigationOptions: () => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="navLink.editProfile" style="subTitle" />,
              headerForceInset: {}
            })
          }
        }),
        userInfo: {
          showOnLogin: true,
          role: ['user', 'admin']
        },
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.profile" />
        }
      },
      Login: {
        screen: AuthScreen,
        userInfo: {
          showOnLogin: false
        },
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.signIn" />
        }
      },
      Users: {
        screen: createStackNavigator({
          Users: {
            screen: Users,
            navigationOptions: ({ navigation }) => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="navLink.users" style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              ),
              headerRight: (
                <IconButton
                  iconName="filter"
                  iconSize={32}
                  iconColor="#0275d8"
                  onPress={() => {
                    const isOpenFilter = navigation.getParam('isOpenFilter');
                    navigation.setParams({ isOpenFilter: !isOpenFilter });
                  }}
                />
              ),
              headerForceInset: {}
            })
          },
          UserEdit: {
            screen: UserEdit,
            navigationOptions: () => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="navLink.editUser" style="subTitle" />,
              headerForceInset: {}
            })
          },
          UserAdd: {
            screen: UserAdd,
            navigationOptions: () => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="navLink.editUser" style="subTitle" />,
              headerForceInset: {}
            })
          }
        }),
        userInfo: {
          showOnLogin: true,
          role: 'admin'
        },
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.users" />
        }
      },
      Logout: {
        screen: () => null,
        userInfo: {
          showOnLogin: true
        },
        navigationOptions: ({ navigation }) => {
          return {
            drawerLabel: <Logout navigation={navigation} />
          };
        }
      }
    }
  ],
  resolver: [resolvers],
  localization: [{ ns: 'user', resources }],
  router: <MainScreenNavigator />,
  dataRootComponent: [DataRootComponent],
  onAppCreate: [async modules => (ref.navigator = UserScreenNavigator(modules.drawerItems))]
});
