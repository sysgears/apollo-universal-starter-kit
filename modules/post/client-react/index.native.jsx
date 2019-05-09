import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { translate } from '@gqlapp/i18n-client-react';
import { Button, HeaderTitle, IconButton, primary } from '@gqlapp/look-client-react-native';
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
  t: PropTypes.func
};

class PostListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(HeaderTitle, { style: 'subTitle', i18nKey: 'list.subTitle' }),
    headerRight: withI18N(PostListHeaderRight, { navigation }),
    headerLeft: (
      <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
    ),
    headerStyle: styles.header,
    headerForceInset: {}
  });

  render() {
    return <Post navigation={this.props.navigation} />;
  }
}

PostListScreen.propTypes = {
  navigation: PropTypes.object
};

const PostEditTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t(`post.label.edit`)} {t('post.label.post')}
  </Text>
);
PostEditTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

const PostAddTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t('post.label.create')} {t('post.label.post')}
  </Text>
);
PostAddTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class PostEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(PostEditTitle, { navigation }),
    headerStyle: styles.header,
    headerForceInset: {}
  });

  render() {
    return <PostEdit navigation={this.props.navigation} />;
  }
}
PostEditScreen.propTypes = {
  navigation: PropTypes.object
};

class PostAddScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(PostAddTitle, { navigation }),
    headerStyle: styles.header,
    headerForceInset: {}
  });

  render() {
    return <PostAdd navigation={this.props.navigation} />;
  }
}

PostAddScreen.propTypes = {
  navigation: PropTypes.object
};

const PostNavigator = createStackNavigator({
  PostList: { screen: PostListScreen },
  PostEdit: { screen: PostEditScreen },
  PostAdd: { screen: PostAddScreen }
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff'
  },
  subTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  addButton: {
    height: 32,
    width: 60
  }
});

export default new ClientModule({
  drawerItem: [
    {
      Post: {
        screen: PostNavigator,
        navigationOptions: {
          drawerLabel: withI18N(HeaderTitle, { i18nKey: 'list.title' })
        }
      }
    }
  ],
  resolver: [resolvers],
  localization: [{ ns: 'post', resources }]
});
