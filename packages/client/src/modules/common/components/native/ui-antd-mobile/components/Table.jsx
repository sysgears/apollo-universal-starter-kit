import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

export default class Table extends React.Component {
  static propTypes = {
    posts: PropTypes.object,
    renderItem: PropTypes.func,
    handlePageChange: PropTypes.func,
    keyExtractor: PropTypes.func,
    itemsNumber: PropTypes.number,
    pagination: PropTypes.string
  };

  render() {
    const { posts, renderItem, handlePageChange, keyExtractor, pagination } = this.props;
    let onEndReachedCalledDuringMomentum = false;
    return (
      <FlatList
        data={posts.edges}
        style={{ marginTop: 5 }}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum) {
            if (posts.pageInfo.hasNextPage && pagination === 'relay') {
              onEndReachedCalledDuringMomentum = true;
              return handlePageChange('relay', null);
            } else {
              return (onEndReachedCalledDuringMomentum = true);
            }
          }
        }}
      />
    );
  }
}
