import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';
import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle } from '@gqlapp/look-client-react-native';
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

const AuthStack = createStackNavigator();
const AuthScreen = translate('user')(({ t }) => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={Login}
      options={{
        title: t('navLink.signIn')
      }}
    />
    <AuthStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        title: t('navLink.forgotPassword')
      }}
    />
    <AuthStack.Screen
      name="Register"
      component={Register}
      options={{
        title: t('navLink.register')
      }}
    />
  </AuthStack.Navigator>
));

const ProfileStack = createStackNavigator();
const ProfileScreen = translate('user')(({ t }) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} options={{ title: t('navLink.profile') }} />
    <ProfileStack.Screen name="ProfileEdit" component={UserEdit} options={{ title: t('navLink.editProfile') }} />
  </ProfileStack.Navigator>
));

class UsersListScreen extends React.Component {
  render() {
    return <Users navigation={this.props.navigation} />;
  }
}

UsersListScreen.propTypes = {
  navigation: PropTypes.object
};

class UserEditScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Edit user'
  });
  render() {
    return <UserEdit navigation={this.props.navigation} />;
  }
}
UserEditScreen.propTypes = {
  navigation: PropTypes.object
};

class UserAddScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Create user'
  });
  render() {
    return <UserAdd navigation={this.props.navigation} />;
  }
}
UserAddScreen.propTypes = {
  navigation: PropTypes.object
};

const HeaderTitleWithI18n = translate('user')(HeaderTitle);

export * from './containers/Auth';

const ref = { navigator: null };

const MainScreenNavigator = () => {
  const Navigator = ref.navigator;
  return <Navigator />;
};

const Stack = createStackNavigator();

const LogoutScreen = (): any => null;

export default new ClientModule({
  drawerItem: [
    {
      screen: Drawer => (
        <Drawer.Screen
          name="AuthStack"
          component={AuthScreen}
          options={{
            drawerLabel: () => <HeaderTitleWithI18n i18nKey="navLink.signIn" />,
            title: ''
          }}
        />
      ),
      userInfo: {
        showOnLogin: false
      }
    },
    {
      screen: Drawer => (
        <Drawer.Screen
          name="Logout"
          component={LogoutScreen}
          options={({ navigation }) => ({
            drawerLabel: () => <Logout navigation={navigation} />
          })}
        />
      ),
      userInfo: {
        showOnLogin: true
      }
    },
    {
      screen: Drawer => (
        <Drawer.Screen
          name="ProfileStack"
          component={ProfileScreen}
          options={{
            drawerLabel: () => <HeaderTitleWithI18n i18nKey="navLink.profile" />,
            title: ''
          }}
        />
      ),
      userInfo: {
        showOnLogin: true,
        role: ['user', 'admin']
      }
    }
  ],
  // drawerItem: [
  //   {
  //     Users: {
  //       screen: createStackNavigator({
  //         Users: {
  //           screen: UsersListScreen,
  //           navigationOptions: ({ navigation }) => ({
  //             headerTitle: <HeaderTitleWithI18n i18nKey="navLink.users" style="subTitle" />,
  //             headerLeft: (
  //               <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
  //             ),
  //             headerRight: (
  //               <IconButton
  //                 iconName="filter"
  //                 iconSize={32}
  //                 iconColor="#0275d8"
  //                 onPress={() => {
  //                   const isOpenFilter = navigation.getParam('isOpenFilter');
  //                   navigation.setParams({ isOpenFilter: !isOpenFilter });
  //                 }}
  //               />
  //             ),
  //             headerForceInset: {}
  //           })
  //         },
  //         UserEdit: {
  //           screen: UserEditScreen,
  //           navigationOptions: () => ({
  //             headerTitle: <HeaderTitleWithI18n i18nKey="navLink.editUser" style="subTitle" />,
  //             headerForceInset: {}
  //           })
  //         },
  //         UserAdd: {
  //           screen: UserAddScreen,
  //           navigationOptions: () => ({
  //             headerTitle: <HeaderTitleWithI18n i18nKey="navLink.editUser" style="subTitle" />,
  //             headerForceInset: {}
  //           })
  //         }
  //       }),
  //       userInfo: {
  //         showOnLogin: true,
  //         role: 'admin'
  //       },
  //       navigationOptions: {
  //         drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.users" />
  //       }
  //     },
  //   }
  // ],
  resolver: [resolvers],
  localization: [{ ns: 'user', resources }],
  router: <MainScreenNavigator />,
  dataRootComponent: [DataRootComponent],
  onAppCreate: [async modules => (ref.navigator = UserScreenNavigator(modules.createDrawerItems(Stack)))]
});
