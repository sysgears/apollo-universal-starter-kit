import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as ADPagination, Button } from 'antd-mobile';
import { Text } from 'react-native';

export default class Pagination extends React.Component {
  static propTypes = {
    totalPages: PropTypes.number,
    handlePageChange: PropTypes.func,
    pagination: PropTypes.string,
    loadMoreText: PropTypes.string,
    hasNextPage: PropTypes.bool
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.pagination !== prevState.pagination ? { pageNumber: 1, pagination: nextProps.pagination } : null;
  }

  state = { pageNumber: 1, pagination: this.props.pagination };

  onPageChange = pageNumber => {
    const { pagination, handlePageChange } = this.props;
    this.setState({ pageNumber: pageNumber }, handlePageChange(pagination, pageNumber));
  };

  onPressLoadMore = () => {
    this.props.handlePageChange(this.props.pagination, null);
  };

  render() {
    const { pageNumber } = this.state;
    const { totalPages, pagination, hasNextPage, loadMoreText } = this.props;
    if (pagination === 'standard') {
      return (
        <ADPagination
          total={totalPages}
          current={pageNumber}
          locale={{ prevText: '<', nextText: '>' }}
          onChange={pageNumber => this.onPageChange(pageNumber)}
        />
      );
    } else {
      return hasNextPage ? (
        <Button type="primary" onClick={this.onPressLoadMore}>
          <Text>{loadMoreText}</Text>
        </Button>
      ) : null;
    }
  }
}
