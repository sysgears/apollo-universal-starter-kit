import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button, Pagination } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';
import paginationConfig from '../../../../../../config/pagination';

const { itemsNumber, type } = paginationConfig.web;

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

  renderMetaData = () => {
    const { t } = this.props;
    return (
      <Helmet
        title={`${settings.app.name} - ${t('list.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('list.meta')}`
          }
        ]}
      />
    );
  };

  handlePageChange = (pagination, pageNumber) => {
    const {
      posts: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;
    if (pagination === 'relay') {
      loadData(endCursor + 1, 'add');
    } else {
      loadData((pageNumber - 1) * itemsNumber, 'replace');
    }
  };

  render() {
    const { loading, posts, t } = this.props;
    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">{t('post.loadMsg')}</div>
        </PageLayout>
      );
    } else {
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
            <Button
              color="primary"
              size="sm"
              className="delete-button"
              onClick={() => this.handleDeletePost(record.id)}
            >
              {t('post.btn.del')}
            </Button>
          )
        }
      ];
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>{t('list.subTitle')}</h2>
          <Link to="/post/0">
            <Button color="primary">{t('list.btn.add')}</Button>
          </Link>
          <h1 />
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
        </PageLayout>
      );
    }
  }
}

export default translate('post')(PostList);
