import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { translate } from '@module/i18n-client-react';
import { PageLayout, Table, Button, Pagination } from '@module/look-client-react';
import settings from '../../../../settings';

const { itemsNumber, type } = settings.pagination.web;

class PostList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    posts: PropTypes.object,
    deletePost: PropTypes.func.isRequired,
    loadData: PropTypes.func,
    t: PropTypes.func
  };

  handleDeletePost = id => {
    const { deletePost } = this.props;
    deletePost(id);
  };

  handlePageChange = (pagination, pageNumber) => {
    const {
      posts: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;

    pagination === 'relay' ? loadData(endCursor + 1, 'add') : loadData((pageNumber - 1) * itemsNumber, 'replace');
  };

  render() {
    const { loading, posts, t } = this.props;
    const columns = [
      {
        title: t('list.column.title'),
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <Link className="post-link" to={`/post/${record.id}`}>
            {text}
          </Link>
        )
      },
      {
        title: t('list.column.actions'),
        key: 'actions',
        width: 50,
        render: (text, record) => (
          <Button color="primary" size="sm" className="delete-button" onClick={() => this.handleDeletePost(record.id)}>
            {t('post.btn.del')}
          </Button>
        )
      }
    ];
    const Loading = () => <div className="text-center">{t('post.loadMsg')}</div>;
    const NoPostsMessage = () => <div className="text-center">{t('post.noPostsMsg')}</div>;
    const RenderPosts = () => (
      <Fragment>
        <Table dataSource={posts.edges.map(({ node }) => node)} columns={columns} />
        <Pagination
          itemsPerPage={posts.edges.length}
          handlePageChange={this.handlePageChange}
          hasNextPage={posts.pageInfo.hasNextPage}
          pagination={type}
          total={posts.totalCount}
          loadMoreText={t('list.btn.more')}
          defaultPageSize={itemsNumber}
        />
      </Fragment>
    );

    return (
      <PageLayout>
        {/* Render metadata */}
        <Helmet
          title={`${settings.app.name} - ${t('list.title')}`}
          meta={[{ name: 'description', content: `${settings.app.name} - ${t('list.meta')}` }]}
        />
        <h2>{t('list.subTitle')}</h2>
        <Link to="/post/new">
          <Button color="primary">{t('list.btn.add')}</Button>
        </Link>
        {/* Render loader */}
        {loading && !posts && <Loading />}
        {/* Render main post content */}
        {posts && posts.totalCount ? <RenderPosts /> : <NoPostsMessage />}
      </PageLayout>
    );
  }
}

export default translate('post')(PostList);
