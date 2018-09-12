import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import translate, { TranslateFunction } from '../../../../i18n';
import { HeaderTitle, IconButton } from '../../../common/components/native';
import Feature from '../../../connector.native';

import resources from './locales';
import { SubscriptionAuthRouter } from './containers/Auth';
import SubscriberPage from './containers/SubscriberPage';
import AddSubscription from './containers/AddSubscription';
import UpdateCreditCard from './containers/UpdateCreditCard';

const HeaderTitleWithI18n = translate('stripeSubscription')(HeaderTitle);
const Loader = translate('stripeSubscription')(({ t }: { t: TranslateFunction }) => <Text>{t('loading')}</Text>);

export default new Feature({
  drawerItem: {
    Subscription: {
      screen: createStackNavigator({
        SubscriberPage: {
          screen: (props: any) => <SubscriptionAuthRouter {...props} loader={Loader} component={SubscriberPage} />,
          navigationOptions: ({ navigation }: any) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="subscriberPage.title" style="subTitle" />,
            headerLeft: (
              <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
            )
          })
        },
        UpdateCreditCard: {
          screen: (props: any) => <SubscriptionAuthRouter {...props} loader={Loader} component={UpdateCreditCard} />,
          navigationOptions: () => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="update.title" style="subTitle" />
          })
        },
        AddSubscription: {
          screen: AddSubscription,
          navigationOptions: ({ navigation }: any) => ({
            headerTitle: <HeaderTitleWithI18n i18nKey="add.title" style="subTitle" />,
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
  localization: { ns: 'stripeSubscription', resources }
});

// headerLeft: ( // TODO: implement go back to Profile
//   <IconButton
//     iconName="menu"
//     iconSize={32}
//     iconColor="#0275d8"
//     onPress={() => navigation.navigate('Profile')}
//   />
// )
