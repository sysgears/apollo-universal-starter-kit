import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import translate from '../../../i18n';
import settings from '../../../../../../settings';
import { PageLayout, Table, Pagination } from '../../common/components/web';
import paginationConfig from '../../../../../../config/pagination';

const { itemsNumber } = paginationConfig.web;

const StandardView = ({ t }) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('meta')}`
        }
      ]}
    />
  );

  const handlePageChange = (pagination, pageNumber) => {
    console.log(pagination, pageNumber);
    //const {
    //   posts: {
    //     pageInfo: {endCursor}
    //   },
    //   loadData
    // } = this.props;
    // if (pagination === 'relay') {
    //   loadData(endCursor + 1, 'add');
    // } else {
    //   loadData((pageNumber - 1) * itemsNumber, 'replace');
    // }
  };

  const columns = [
    {
      title: t('list.column.title'),
      dataIndex: 'title',
      key: 'title',
      render: () => {}
      // <span>{text}</span>
    }
  ];

  const data = {
    posts: {
      totalCount: 40,
      edges: [
        {
          cursor: 0,
          node: { id: 50, title: 'dfgd', content: '34534', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 1,
          node: { id: 49, title: '34534', content: '345', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 2,
          node: { id: 46, title: 'edtyg', content: '234234', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 3,
          node: { id: 45, title: 'tyge', content: '354345', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 4,
          node: { id: 44, title: 'dfeg', content: '3453', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 5,
          node: { id: 43, title: '34534', content: 'dfetygd', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 6,
          node: { id: 42, title: 'dertyg', content: '3453', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 7,
          node: { id: 41, title: 'dfgdfhf', content: '345', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 8,
          node: { id: 40, title: 'Hhj', content: 'Yyh', __typename: 'Post' },
          __typename: 'PostEdges'
        },
        {
          cursor: 9,
          node: { id: 39, title: 'Kkjnb', content: 'Fghh', __typename: 'Post' },
          __typename: 'PostEdges'
        }
      ],
      pageInfo: { endCursor: 9, hasNextPage: true, __typename: 'PostPageInfo' },
      __typename: 'Posts'
    }
  };

  return (
    <PageLayout>
      {renderMetaData()}
      <h2>{t('list.title.standard')}</h2>
      <Table dataSource={data.posts.edges.map(({ node }) => node)} columns={columns} />
      <Pagination
        displayedAmount={data.posts.edges.length}
        handlePageChange={handlePageChange}
        hasNextPage={data.posts.pageInfo.hasNextPage}
        pagination={'standard'}
        totalCount={data.posts.totalCount}
        loadMoreText={t('list.btn.more')}
        itemsNumber={itemsNumber}
      />
      <h2>{t('list.title.relay')}</h2>
      <Table dataSource={data.posts.edges.map(({ node }) => node)} columns={columns} />
      <Pagination
        displayedAmount={data.posts.edges.length}
        handlePageChange={handlePageChange}
        hasNextPage={data.posts.pageInfo.hasNextPage}
        pagination={'relay'}
        totalCount={data.posts.totalCount}
        loadMoreText={t('list.btn.more')}
        itemsNumber={itemsNumber}
      />
    </PageLayout>
  );
};

StandardView.propTypes = {
  t: PropTypes.func
};

export default translate('pagination')(StandardView);
