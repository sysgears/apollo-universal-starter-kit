import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button } from '../../common/components/web';
import settings from '../../../../../settings';

export default class PostList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    posts: PropTypes.object,
    deletePost: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired
  };

  hendleDeletePost = id => {
    const { deletePost } = this.props;
    deletePost(id);
  };

  renderLoadMore = (posts, loadMoreRows) => {
    if (posts.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Posts list`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - List of all posts example page`
        }
      ]}
    />
  );

  render() {
    const { loading, posts, loadMoreRows } = this.props;
    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text, record) => (
            <Link className="post-link" to={`/post/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 50,
          render: (text, record) => (
            <Button
              color="primary"
              size="sm"
              className="delete-button"
              onClick={() => this.hendleDeletePost(record.id)}
            >
              Delete
            </Button>
          )
        }
      ];
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>Posts</h2>
          <Link to="/post/0">
            <Button color="primary">Add</Button>
          </Link>
          <h1 />
          <Table dataSource={posts.edges.map(({ node }) => node)} columns={columns} />
          <div>
            <small>
              ({posts.edges.length} / {posts.totalCount})
            </small>
          </div>
          {this.renderLoadMore(posts, loadMoreRows)}
        </PageLayout>
      );
    }
  }
}
