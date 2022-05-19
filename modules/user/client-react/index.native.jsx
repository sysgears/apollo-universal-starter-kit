import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';
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

const AuthStack = createStackNavigator();
const AuthScreen = translate('user')(({ t }) => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={Login}
      options={{
        title: t('navLink.signIn'),
      }}
    />
    <AuthStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        title: t('navLink.forgotPassword'),
      }}
    />
    <AuthStack.Screen
      name="Register"
      component={Register}
      options={{
        title: t('navLink.register'),
      }}
    />
  </AuthStack.Navigator>
));

const ProfileStack = createStackNavigator();
const ProfileScreen = translate('user')(({ t }) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="ProfileInfo" component={Profile} options={{ title: t('navLink.profile') }} />
    <ProfileStack.Screen name="ProfileEdit" component={UserEdit} options={{ title: t('navLink.editProfile') }} />
  </ProfileStack.Navigator>
));

const UsersStack = createStackNavigator();
const UsersScreen = translate('user')(({ t }) => (
  <UsersStack.Navigator>
    <UsersStack.Screen
      name="UserList"
      component={Users}
      options={({ navigation, route }) => ({
        headerRight: () => (
          <IconButton
            iconName="filter"
            iconSize={32}
            iconColor="#0275d8"
            onPress={() => {
              const isOpenFilter = route.params?.isOpenFilter;
              navigation.setParams({ isOpenFilter: !isOpenFilter });
            }}
          />
        ),
        title: t('navLink.users'),
      })}
    />
    <UsersStack.Screen name="UserEdit" component={UserEdit} options={{ title: t('navLink.editUser') }} />
    <UsersStack.Screen name="UserAdd" component={UserAdd} options={{ title: t('navLink.editUser') }} />
  </UsersStack.Navigator>
));

class UsersListScreen extends React.Component {
  render() {
    return <Users navigation={this.props.navigation} />;
  }
}

UsersListScreen.propTypes = {
  navigation: PropTypes.object,
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
      screen: (Drawer) => (
        <Drawer.Screen
          name="AuthStack"
          component={AuthScreen}
          options={{
            drawerLabel: () => <HeaderTitleWithI18n i18nKey="navLink.signIn" />,
            title: '',
          }}
        />
      ),
      userInfo: {
        showOnLogin: false,
      },
    },
    {
      screen: (Drawer) => (
        <Drawer.Screen
          name="Logout"
          component={LogoutScreen}
          options={({ navigation }) => ({
            drawerLabel: () => <Logout navigation={navigation} />,
          })}
        />
      ),
      userInfo: {
        showOnLogin: true,
      },
    },
    {
      screen: (Drawer) => (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerLabel: () => <HeaderTitleWithI18n i18nKey="navLink.profile" />,
            title: '',
          }}
        />
      ),
      userInfo: {
        showOnLogin: true,
        role: ['user', 'admin'],
      },
    },
    {
      screen: (Drawer) => (
        <Drawer.Screen
          name="UsersStack"
          component={UsersScreen}
          options={{
            drawerLabel: () => <HeaderTitleWithI18n i18nKey="navLink.users" />,
            title: '',
          }}
        />
      ),
      userInfo: {
        showOnLogin: true,
        role: 'admin',
      },
    },
  ],
  resolver: [resolvers],
  localization: [{ ns: 'user', resources }],
  router: <MainScreenNavigator />,
  dataRootComponent: [DataRootComponent],
  onAppCreate: [async (modules) => (ref.navigator = UserScreenNavigator(modules.createDrawerItems(Stack)))],
});
