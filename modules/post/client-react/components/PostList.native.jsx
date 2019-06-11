import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, Platform, TouchableOpacity, View, FlatList } from 'react-native';
import { translate } from '@gqlapp/i18n-client-react';
import { SwipeAction, Loading } from '@gqlapp/look-client-react-native';

const ItemIOS = (
  { deletePost, navigation, t },
  {
    item: {
      node: { id, title }
    }
  }
) => (
  <SwipeAction
    onPress={() => navigation.navigate('PostEdit', { id })}
    right={{
      text: t('list.btn.del'),
      onPress: () => deletePost(id)
    }}
  >
    {title}
  </SwipeAction>
);

ItemIOS.propTypes = {
  navigation: PropTypes.object,
  deletePost: PropTypes.func,
  t: PropTypes.func
};

const ItemAndroid = (
  { deletePost, navigation },
  {
    item: {
      node: { id, title }
    }
  }
) => (
  <TouchableOpacity style={styles.postWrapper} onPress={() => navigation.navigate('PostEdit', { id })}>
    <Text style={styles.text}>{title}</Text>
    <TouchableOpacity style={styles.iconWrapper} onPress={() => deletePost(id)}>
      <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
    </TouchableOpacity>
  </TouchableOpacity>
);

ItemAndroid.propTypes = {
  navigation: PropTypes.object,
  deletePost: PropTypes.func
};

const PostList = props => {
  const { loading, posts, loadData, t } = props;
  let allowDataLoad = false;

  const handleScrollEvent = () => {
    const {
      pageInfo: { endCursor, hasNextPage }
    } = posts;

    if (allowDataLoad && !loading && hasNextPage) {
      allowDataLoad = false;
      return loadData(endCursor + 1, 'add');
    }
  };

  const renderItem = Platform.OS === 'android' ? item => ItemAndroid(props, item) : item => ItemIOS(props, item);

  if (loading) {
    return <Loading text={t('post.loadMsg')} />;
  } else if (posts && !posts.totalCount) {
    return <Loading text={t('post.noPostsMsg')} />;
  } else {
    allowDataLoad = true;
    return (
      <View style={styles.container}>
        <FlatList
          data={posts.edges}
          style={styles.list}
          keyExtractor={item => `${item.node.id}`}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={handleScrollEvent}
        />
      </View>
    );
  }
};

PostList.propTypes = {
  loading: PropTypes.bool.isRequired,
  posts: PropTypes.object,
  navigation: PropTypes.object,
  deletePost: PropTypes.func.isRequired,
  loadData: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('post')(PostList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  text: {
    fontSize: 18
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  postWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    height: 50,
    paddingLeft: 7
  },
  list: {
    marginTop: 5
  }
});
