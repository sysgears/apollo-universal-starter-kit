import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayout, Table, Button } from '../../common/components/web';
import settings from '../../../../../../settings';

class PostList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    posts: PropTypes.object,
    deletePost: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleDeletePost = id => {
    const { deletePost } = this.props;
    deletePost(id);
  };

  renderLoadMore = (posts, loadMoreRows) => {
    const { t } = this.props;
    if (posts.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          {t('list.btn.more')}
        </Button>
      );
    }
  };

  renderPosts = () => {
    const { posts, loadMoreRows, t } = this.props;
    if (posts && posts.totalCount && posts.edges.length <= posts.totalCount) {
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
        <div>
          <Table dataSource={posts.edges.map(({ node }) => node)} columns={columns} />
          <div>
            <small>
              ({posts.edges.length} / {posts.totalCount})
            </small>
          </div>
          {this.renderLoadMore(posts, loadMoreRows)}
        </div>
      );
    } else {
      return <div className="text-center">{t('post.noPostsMsg')}</div>;
    }
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

  render() {
    const { loading, t } = this.props;

    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">{t('post.loadMsg')}</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>{t('list.subTitle')}</h2>
          <Link to="/post/0">
            <Button color="primary">{t('list.btn.add')}</Button>
          </Link>
          <h1 />
          {this.renderPosts()}
        </PageLayout>
      );
    }
  }
}

export default translate('post')(PostList);
