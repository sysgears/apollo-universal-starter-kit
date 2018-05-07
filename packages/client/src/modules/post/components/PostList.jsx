/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';

import translate from '../../../i18n';
import { SwipeAction, Table } from '../../common/components/native';

class PostList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    posts: PropTypes.object,
    navigation: PropTypes.object,
    deletePost: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    paginationConfig: PropTypes.object,
    t: PropTypes.func
  };

  keyExtractor = item => item.node.id.toString();

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
      paginationConfig,
      loadData
    } = this.props;
    if (pagination === 'relay') {
      loadData(endCursor, 'add');
    } else {
      loadData((pageNumber - 1) * paginationConfig.mobile.itemsNumber, 'replace');
    }
  };

  render() {
    const { loading, posts, t, paginationConfig } = this.props;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>{t('post.loadMsg')}</Text>
        </View>
      );
    } else {
      return (
        <Table
          posts={posts}
          renderItem={renderItem}
          handlePageChange={this.handlePageChange}
          keyExtractor={this.keyExtractor}
          itemsNumber={paginationConfig.mobile.itemsNumber}
          pagination={paginationConfig.mobile.type}
        />
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
