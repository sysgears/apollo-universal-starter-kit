/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, Platform, TouchableOpacity, View, FlatList } from 'react-native';
import translate from '../../../i18n';
import { SwipeAction, Loading } from '../../common/components/native';

class PostList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    posts: PropTypes.object,
    navigation: PropTypes.object,
    deletePost: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  keyExtractor = item => `${item.node.id}`;

  renderItemIOS = ({
    item: {
      node: { id, title }
    }
  }) => {
    const { deletePost, navigation, t } = this.props;
    return (
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
  };

  renderItemAndroid = ({
    item: {
      node: { id, title }
    }
  }) => {
    const { deletePost, navigation } = this.props;
    return (
      <TouchableOpacity style={styles.postWrapper} onPress={() => navigation.navigate('PostEdit', { id })}>
        <Text style={styles.text}>{title}</Text>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => deletePost(id)}>
          <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  handleScrollEvent = () => {
    const {
      posts: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;
    if (this.allowDataLoad) {
      if (this.props.posts.pageInfo.hasNextPage) {
        this.allowDataLoad = false;
        return loadData(endCursor + 1, 'add');
      }
    }
  };

  render() {
    const { loading, posts, t } = this.props;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    if (loading) {
      return <Loading text={t('post.loadMsg')} />;
    } else {
      this.allowDataLoad = true;
      return (
        <View style={styles.container}>
          <FlatList
            data={posts.edges}
            ref={ref => (this.listRef = ref)}
            style={styles.list}
            keyExtractor={this.keyExtractor}
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={this.handleScrollEvent}
          />
        </View>
      );
    }
  }
}

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
