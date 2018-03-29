import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { translate } from 'react-i18next';

import { createTabBarIconWrapper } from '../common/components/native';

import Post from './containers/Post';
import PostEdit from './containers/PostEdit';

import resources from './locales';
import resolvers from './resolvers';

import Feature from '../connector';

const withI18N = Component => {
  const WithI18N = translate('post')(Component);
  return <WithI18N />;
};

const PostListTitle = ({ t }) => <Text style={styles.listTitle}>{t('list.subTitle')}</Text>;
PostListTitle.propTypes = {
  t: PropTypes.func
};

const NavTitle = ({ t }) => <Text style={styles.menuLabel}>{t('list.title')}</Text>;
NavTitle.propTypes = {
  t: PropTypes.func
};

class PostListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    // headerTitle: <PostListTitleWithI18n style={styles.listTitle} />,
    headerTitle: withI18N(PostListTitle),
    headerRight: <PostListHeaderRightWithI18n navigation={navigation} />
  });

  render() {
    return <Post navigation={this.props.navigation} />;
  }
}

PostListScreen.propTypes = {
  navigation: PropTypes.object
};

const PostListHeaderRight = ({ navigation, t }) => (
  <Button title={t('list.btn.add')} onPress={() => navigation.navigate('PostEdit', { id: 0 })} />
);
PostListHeaderRight.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};
const PostListHeaderRightWithI18n = translate('post')(PostListHeaderRight);

class PostEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <PostEditTitleWithI18n navigation={navigation} />
  });
  render() {
    return <PostEdit navigation={this.props.navigation} />;
  }
}

PostEditScreen.propTypes = {
  navigation: PropTypes.object
};

const PostEditTitle = ({ navigation, t }) => (
  <Text>
    {navigation.state.params.id === 0 ? t('post.label.create') : t('post.label.edit')} {t('post.label.post')}
  </Text>
);
PostEditTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};
const PostEditTitleWithI18n = translate('post')(PostEditTitle);

const PostNavigator = StackNavigator({
  PostList: { screen: PostListScreen },
  PostEdit: { screen: PostEditScreen }
});

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  menuLabel: {
    color: 'white'
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
        tabBarLabel: withI18N(NavTitle)
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'post', resources }
});
