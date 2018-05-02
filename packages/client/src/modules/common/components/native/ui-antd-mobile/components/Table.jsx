import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, View } from 'react-native';
import { Pagination } from 'antd-mobile/lib';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

class Table extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    posts: PropTypes.object,
    renderItem: PropTypes.func,
    loadMessage: PropTypes.string,
    handlePageChange: PropTypes.func,
    styles: PropTypes.object,
    keyExtractor: PropTypes.func,
    limit: PropTypes.number,
    pagination: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  renderStandardPagination = (pagination, totalPages, handlePageChange) => {
    if (pagination === STANDARD_PAGINATION) {
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
    handlePageChange(STANDARD_PAGINATION, pageNumber);
  };

  render() {
    const {
      loading,
      posts,
      renderItem,
      loadMessage,
      handlePageChange,
      styles,
      keyExtractor,
      limit,
      pagination
    } = this.props;
    let onEndReachedCalledDuringMomentum = false;
    const totalPages = Math.ceil(posts.totalCount / limit);
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>{loadMessage}</Text>
        </View>
      );
    } else {
      return (
        <View>
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
              if (!onEndReachedCalledDuringMomentum && pagination === RELAY_PAGINATION) {
                if (posts.pageInfo.hasNextPage) {
                  onEndReachedCalledDuringMomentum = true;
                  return handlePageChange(RELAY_PAGINATION, null);
                }
              }
            }}
          />
          {this.renderStandardPagination(pagination, totalPages, handlePageChange)}
        </View>
      );
    }
  }
}

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
