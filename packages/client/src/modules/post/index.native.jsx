import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text, StyleSheet, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { translate } from 'react-i18next';

import { HeaderTitle, MenuButton } from '../common/components/native';

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
    headerTitle: withI18N(HeaderTitle, { style: 'subTitle', i18nKey: 'list.subTitle' }),
    headerRight: withI18N(PostListHeaderRight, { navigation }),
    headerLeft: <MenuButton navigation={navigation} />
  });

  render() {
    return <Post navigation={this.props.navigation} />;
  }
}
PostListScreen.propTypes = {
  navigation: PropTypes.object
};

const PostEditTitle = ({ navigation: { state: { params: { id } } }, t }) => (
  <Text style={styles.subTitle}>
    {t(`post.label.${id === 0 ? 'create' : 'edit'}`)} {t('post.label.post')}
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
  drawerItem: {
    Post: {
      screen: PostNavigator,
      navigationOptions: {
        drawerLabel: withI18N(HeaderTitle, { i18nKey: 'list.title' })
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'post', resources }
});
