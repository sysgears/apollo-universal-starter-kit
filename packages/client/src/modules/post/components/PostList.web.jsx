import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button, STANDARD_PAGINATION, RELAY_PAGINATION } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';
import { LIMIT } from '../containers/Post';

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

  // renderLoadMore = (posts, loadMoreRows) => {
  //   const { t } = this.props;
  //   if (posts.pageInfo.hasNextPage) {
  //     return (
  //       <Button id="load-more" color="primary" onClick={loadMoreRows}>
  //         {t('list.btn.more')}
  //       </Button>
  //     );
  //   }
  // };

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

  handlePageChange = (pagination = RELAY_PAGINATION, pageNumber = null) => {
    const newOffset = (pageNumber - 1) * LIMIT;
    const offset = pagination === RELAY_PAGINATION ? this.props.posts.pageInfo.endCursor : newOffset;
    const dataDelivery = pagination === RELAY_PAGINATION ? 'add' : 'replace';
    this.props.loadData(offset, dataDelivery);
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
          <Table
            dataSource={posts.edges.map(({ node }) => node)}
            columns={columns}
            pagination={STANDARD_PAGINATION}
            pageInfo={posts.pageInfo}
            handlePageChange={this.handlePageChange}
            totalCount={posts.totalCount}
          />
        </PageLayout>
      );
    }
  }
}

export default translate('post')(PostList);
