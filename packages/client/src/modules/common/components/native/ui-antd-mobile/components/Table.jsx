import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, ScrollView } from 'react-native';
import Pagination from 'antd-mobile/lib/pagination';

export default class Table extends React.Component {
  static propTypes = {
    posts: PropTypes.object,
    renderItem: PropTypes.func,
    handlePageChange: PropTypes.func,
    keyExtractor: PropTypes.func,
    itemsNumber: PropTypes.number,
    pagination: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  renderStandardPagination = (pagination, totalPages, handlePageChange) => {
    if (pagination === 'standard') {
      const locale = {
        prevText: '<',
        nextText: '>'
      };
      return (
        <Pagination
          total={totalPages}
          current={this.state.pageNumber}
          locale={locale}
          onChange={pageNumber => this.handleStandardPaginationPageChange(pageNumber, handlePageChange)}
        />
      );
    }
  };

  handleStandardPaginationPageChange = (pageNumber, handlePageChange) => {
    this.setState({ pageNumber: pageNumber });
    handlePageChange('standard', pageNumber);
  };

  render() {
    const { posts, renderItem, handlePageChange, keyExtractor, itemsNumber, pagination } = this.props;
    let onEndReachedCalledDuringMomentum = false;
    const totalPages = Math.ceil(posts.totalCount / itemsNumber);
    return (
      <ScrollView style={{ flex: 1 }}>
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
        {this.renderStandardPagination(pagination, totalPages, handlePageChange)}
      </ScrollView>
    );
  }
}
