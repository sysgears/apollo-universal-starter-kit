import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { translate } from '@gqlapp/i18n-client-react';
import { Button, HeaderTitle, primary } from '@gqlapp/look-client-react-native';
import ClientModule from '@gqlapp/module-client-react-native';

import Post from './containers/Post';
import PostEdit from './containers/PostEdit';
import PostAdd from './containers/PostAdd';

import resources from './locales';
import resolvers from './resolvers';

const withI18N = (Component, props) => {
  const WithI18N = translate('post')(Component);
  return <WithI18N {...props} />;
};

const PostListHeaderRight = ({ navigation, t }) => {
  return (
    <View style={styles.addButtonContainer}>
      <Button style={styles.addButton} size={'small'} type={primary} onPress={() => navigation.navigate('PostAdd')}>
        {t('list.btn.add')}
      </Button>
    </View>
  );
};
PostListHeaderRight.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func,
};

const PostEditTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t(`post.label.edit`)} {t('post.label.post')}
  </Text>
);
PostEditTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func,
};

const PostAddTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t('post.label.create')} {t('post.label.post')}
  </Text>
);
PostAddTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func,
};

const Stack = createStackNavigator();

const PostNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PostList"
      component={Post}
      options={({ navigation }) => ({
        headerTitle: () => withI18N(HeaderTitle, { style: 'subTitle', i18nKey: 'list.subTitle' }),
        headerRight: () => withI18N(PostListHeaderRight, { navigation }),
        headerStyle: styles.header,
      })}
    />
    <Stack.Screen
      name="PostEdit"
      component={PostEdit}
      options={({ navigation }) => ({
        headerTitle: () => withI18N(PostEditTitle, { navigation }),
        headerStyle: styles.header,
      })}
    />
    <Stack.Screen
      name="PostAdd"
      component={PostAdd}
      options={({ navigation }) => ({
        headerTitle: () => withI18N(PostAddTitle, { navigation }),
        headerStyle: styles.header,
      })}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
  },
  subTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16,
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  addButton: {
    height: 32,
    width: 60,
  },
});

export default new ClientModule({
  drawerItem: [
    {
      screen: (Drawer) => (
        <Drawer.Screen
          name="Post"
          component={PostNavigator}
          options={() => ({
            drawerLabel: () => withI18N(HeaderTitle, { i18nKey: 'list.title' }),
          })}
        />
      ),
    },
  ],
  resolver: [resolvers],
  localization: [{ ns: 'post', resources }],
});
