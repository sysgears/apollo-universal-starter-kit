import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import translate from '../../../../i18n';
import { HeaderTitle, IconButton } from '../../../common/components/native';
import SubscriberPage from './containers/SubscriberPage';
import AddSubscription from './containers/AddSubscription';
import UpdateCreditCard from './containers/UpdateCreditCard';
import { SubscriptionAuthRouter } from './containers/Auth';
import resources from './locales';

import Feature from '../../../connector';

const HeaderTitleWithI18n = translate('subscription')(HeaderTitle);

const Loader = () => <Text>Loading...</Text>; // TODO: internationalisation

export default new Feature({
  drawerItem: {
    Subscription: {
      screen: createStackNavigator({
        SubscriberPage: {
          screen: props => <SubscriptionAuthRouter {...props} loader={Loader} component={SubscriberPage} />, // TODO: Fix react error
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="subOnly.title" style="subTitle" />,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            )
          })
        },
        UpdateCreditCard: {
          screen: props => <SubscriptionAuthRouter {...props} loader={Loader} component={UpdateCreditCard} />,
          navigationOptions: () => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="update.title" style="subTitle" />
            // headerLeft: ( // TODO: implement go back to Profile
            //   <IconButton
            //     iconName="menu"
            //     iconSize={32}
            //     iconColor="#0275d8"
            //     onPress={() => navigation.navigate('Profile')}
            //   />
            // )
          })
        },
        Subscription: {
          screen: AddSubscription,
          navigationOptions: ({ navigation }) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="title" style="subTitle" />,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            )
          })
        }
      }),
      userInfo: {
        showOnLogin: true,
        role: ['user']
      },
      navigationOptions: {
        drawerLabel: <HeaderTitleWithI18n />
      }
    }
  },
  localization: { ns: 'subscription', resources }
});
