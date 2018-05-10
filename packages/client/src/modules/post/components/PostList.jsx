/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View, Platform, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import translate from '../../../i18n';
import { SwipeAction, Pagination } from '../../common/components/native';
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

  onEndReachedCalledDuringMomentum = false;

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
      loadData((pageNumber - 1) * itemsNumber, 'replace');
    }
  };

  render() {
    const { loading, posts, t } = this.props;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>{t('post.loadMsg')}</Text>
        </View>
      );
    } else {
      return (
        <ScrollView style={{ flex: 1 }}>
          <FlatList
            data={posts.edges}
            style={{ marginTop: 5 }}
            keyExtractor={this.keyExtractor}
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onEndReached={() => {
              if (!this.onEndReachedCalledDuringMomentum) {
                if (posts.pageInfo.hasNextPage && type === 'relay') {
                  this.onEndReachedCalledDuringMomentum = true;
                  return this.handlePageChange('relay', null);
                } else {
                  return (this.onEndReachedCalledDuringMomentum = true);
                }
              }
            }}
          />
          <Pagination
            totalPages={Math.ceil(posts.totalCount / itemsNumber)}
            handlePageChange={this.handlePageChange}
            pagination={type}
          />
        </ScrollView>
      );
    }
  }
}

export default translate('post')(PostList);

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    height: 48,
    paddingLeft: 7
  }
});
