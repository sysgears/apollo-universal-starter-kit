/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, Platform, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import translate from '../../../i18n';
import { SwipeAction, Pagination, Loading } from '../../common/components/native';
import paginationConfig from '../../../../../../config/pagination';

const { itemsNumber, type } = paginationConfig.mobile;

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

  handlePageChange = (pagination, pageNumber) => {
    const {
      posts: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;
    if (pagination === 'relay') {
      loadData(endCursor + 1, 'add');
    } else {
      this.listRef.scrollToIndex({ viewPosition: 0.5, index: 0 });
      loadData((pageNumber - 1) * itemsNumber, 'replace');
    }
  };

  // handleScrollEvent = () => {
  //   const {
  //     posts: {
  //       pageInfo: { endCursor }
  //     },
  //     loadData
  //   } = this.props;
  //   if (this.allowLoadData) {
  //     if (this.props.posts.pageInfo.hasNextPage) {
  //       this.allowLoadData = false;
  //       return loadData(endCursor + 1, 'add');
  //     }
  //   }
  // };

  render() {
    const { loading, posts, t } = this.props;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    const containerStyle = type === 'relay' ? styles.relayPaginationContainer : styles.standardPaginationContainer;
    // const paginationStyle = type === 'standard' ? styles.pagination : null;
    if (loading) {
      return <Loading text={t('post.loadMsg')} />;
    } else {
      this.allowLoadData = true;
      return (
        <View style={{ flex: 1 }}>
          <ScrollView style={containerStyle}>
            <FlatList
              data={posts.edges}
              ref={ref => (this.listRef = ref)}
              style={{ marginTop: 5 }}
              keyExtractor={this.keyExtractor}
              renderItem={renderItem}
              // onEndReachedThreshold={0.5}
              // onEndReached={this.handleScrollEvent}
            />
            <View>
              <Pagination
                totalPages={Math.ceil(posts.totalCount / itemsNumber)}
                loadMoreText={t('list.btn.more')}
                handlePageChange={this.handlePageChange}
                pagination={type}
                hasNextPage={posts.pageInfo.hasNextPage}
              />
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

export default translate('post')(PostList);

const styles = StyleSheet.create({
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
    height: 48,
    paddingLeft: 7
  },
  relayContainer: {
    flex: 1
  },
  standardContainer: {
    flex: 0.9
  },
  standardView: {
    flex: 0.1
  }
});
