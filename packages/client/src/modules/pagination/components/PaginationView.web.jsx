import React from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination } from '../../common/components/web';
import translate from '../../../i18n';

const PaginationView = ({ data, handlePageChange, pagination, t }) => {
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
      <Table dataSource={data.edges.map(({ node }) => node)} columns={columns} />
      <Pagination
        displayedAmount={data.edges.length}
        handlePageChange={handlePageChange}
        hasNextPage={data.pageInfo.hasNextPage}
        pagination={pagination}
        totalCount={data.totalCount}
        loadMoreText={t('list.btn.more')}
        itemsNumber={data.limit}
      />
    </div>
  );
};

PaginationView.propTypes = {
  data: PropTypes.object,
  handlePageChange: PropTypes.func,
  t: PropTypes.func,
  pagination: PropTypes.string
};

export default translate('pagination')(PaginationView);
