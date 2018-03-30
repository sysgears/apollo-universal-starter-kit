import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text, StyleSheet, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { translate } from 'react-i18next';

import { createTabBarIconWrapper, HeaderTitle } from '../common/components/native';

import Post from './containers/Post';
import PostEdit from './containers/PostEdit';

import resources from './locales';
import resolvers from './resolvers';

import Feature from '../connector';

const withI18N = (Component, props) => {
  const WithI18N = translate('post')(Component);
  return <WithI18N {...props} />;
};

const PostListHeaderRight = ({ navigation, t }) => (
  <Button title={t('list.btn.add')} onPress={() => navigation.navigate('PostEdit', { id: 0 })} />
);
PostListHeaderRight.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class PostListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(HeaderTitle, { style: styles.subTitle, i18nKey: 'list.subTitle' }),
    headerRight: withI18N(PostListHeaderRight, { navigation })
  });

  render() {
    return <Post navigation={this.props.navigation} />;
  }
}
PostListScreen.propTypes = {
  navigation: PropTypes.object
};

const PostEditTitle = ({ navigation, t }) => (
  <Text style={styles.subTitle}>
    {navigation.state.params.id === 0 ? t('post.label.create') : t('post.label.edit')} {t('post.label.post')}
  </Text>
);
PostEditTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class PostEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(PostEditTitle, { navigation })
  });
  render() {
    return <PostEdit navigation={this.props.navigation} />;
  }
}
PostEditScreen.propTypes = {
  navigation: PropTypes.object
};

const PostNavigator = StackNavigator({
  PostList: { screen: PostListScreen },
  PostEdit: { screen: PostEditScreen }
});

const styles = StyleSheet.create({
  subTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16
  }
});

export default new Feature({
  tabItem: {
    Post: {
      screen: PostNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-book-outline',
          size: 30
        }),
        tabBarLabel: withI18N(HeaderTitle, { i18nKey: 'list.title' })
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'post', resources }
});
