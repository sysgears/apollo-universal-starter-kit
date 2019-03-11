import React from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination } from '@gqlapp/look-client-react';
import { translate } from '@gqlapp/i18n-client-react';

const PaginationDemoView = ({ items, handlePageChange, pagination, t }) => {
  const renderFunc = text => <span>{text}</span>;
  const columns = [
    {
      title: t('list.column.title'),
      dataIndex: 'title',
      key: 'title',
      displayName: 'MyComponent',
      render: renderFunc
    }
  ];
  return (
    <div>
      <Table dataSource={items.edges.map(({ node }) => node)} columns={columns} />
      <Pagination
        itemsPerPage={items.edges.length}
        handlePageChange={handlePageChange}
        hasNextPage={items.pageInfo.hasNextPage}
        pagination={pagination}
        total={items.totalCount}
        loadMoreText={t('list.btn.more')}
        defaultPageSize={items.limit}
      />
    </div>
  );
};

PaginationDemoView.propTypes = {
  items: PropTypes.object,
  handlePageChange: PropTypes.func,
  t: PropTypes.func,
  pagination: PropTypes.string
};

export default translate('pagination')(PaginationDemoView);
