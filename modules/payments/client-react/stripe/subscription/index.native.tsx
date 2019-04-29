import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';
import ClientModule from '@gqlapp/module-client-react-native';
import settings from '@gqlapp/config';

import resources from './locales';
import SubscriptionAuthRouter from './containers/Auth';
import SubscriberPage from './containers/SubscriberPage';
import AddSubscription from './containers/AddSubscription';
import UpdateCreditCard from './containers/UpdateCreditCard';

const HeaderTitleWithI18n = translate('stripeSubscription')(HeaderTitle);

export default (settings.stripe.subscription.enabled && settings.stripe.subscription.publicKey
  ? new ClientModule({
      drawerItem: [
        {
          Subscription: {
            screen: createStackNavigator({
              SubscriberPage: {
                screen: (props: any) => <SubscriptionAuthRouter {...props} component={SubscriberPage} />,
                navigationOptions: ({ navigation }: any) => ({
                  headerTitle: <HeaderTitleWithI18n i18nKey="subscriberPage.title" style="subTitle" />,
                  headerLeft: (
                    <IconButton
                      iconName="menu"
                      iconSize={32}
                      iconColor="#0275d8"
                      onPress={() => navigation.openDrawer()}
                    />
                  )
                })
              },
              UpdateCreditCard: {
                screen: (props: any) => <SubscriptionAuthRouter {...props} component={UpdateCreditCard} />,
                navigationOptions: ({ navigation }: any) => ({
                  headerTitle: <HeaderTitleWithI18n i18nKey="update.title" style="subTitle" />,
                  // custom back button to User profile
                  headerLeft: (
                    <IconButton
                      iconName="arrow-left"
                      iconSize={32}
                      iconColor="#000"
                      onPress={() => navigation.navigate('Profile')}
                    />
                  )
                })
              },
              AddSubscription: {
                screen: AddSubscription,
                navigationOptions: ({ navigation }: any) => ({
                  headerTitle: <HeaderTitleWithI18n i18nKey="add.title" style="subTitle" />,
                  headerLeft: (
                    <IconButton
                      iconName="menu"
                      iconSize={32}
                      iconColor="#0275d8"
                      onPress={() => navigation.openDrawer()}
                    />
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
        }
      ],
      localization: [{ ns: 'stripeSubscription', resources }]
    })
  : undefined);
