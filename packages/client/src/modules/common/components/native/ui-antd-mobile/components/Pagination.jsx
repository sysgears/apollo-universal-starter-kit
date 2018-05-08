import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as ADPagination } from 'antd-mobile/lib';

export default class Pagination extends React.Component {
  static propTypes = {
    totalPages: PropTypes.number,
    handlePageChange: PropTypes.func,
    pagination: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  componentDidUpdate() {
    if (this.props.pagination === 'standard') {
      this.props.handlePageChange(this.props.pagination, this.state.pageNumber);
    }
  }

  handleStandardPaginationPageChange = pageNumber => {
    this.setState({ pageNumber: pageNumber });
  };

  render() {
    const { pageNumber } = this.state;
    const { totalPages, pagination } = this.props;
    if (pagination === 'standard') {
      const locale = {
        prevText: '<',
        nextText: '>'
      };
      return (
        <ADPagination
          total={totalPages}
          current={pageNumber}
          locale={locale}
          onChange={pageNumber => this.handleStandardPaginationPageChange(pageNumber)}
        />
      );
    } else {
      return null;
    }
  }
}
