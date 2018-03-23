import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button } from '../../common/components/web';
import settings from '../../../../../../settings';

import { PostProps, LoadMoreRowsFn, Post } from '../types/post';
import { EntityList } from '../../../../../common/types';

export default class PostList extends React.PureComponent<PostProps, any> {
  public handleDeletePost = (id: number) => {
    const { deletePost } = this.props;
    deletePost(id);
  };

  public renderLoadMore = (posts: EntityList<Post>, loadMoreRows: LoadMoreRowsFn) => {
    if (posts.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  };

  public renderMetaData = () => (
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

  public render() {
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
          render: (text: string, record: any) => (
            <Link className="post-link" to={`/post/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 50,
          render: (text: string, record: any) => (
            <Button
              color="primary"
              size="sm"
              className="delete-button"
              onClick={() => this.handleDeletePost(record.id)}
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
          <Table dataSource={posts.edges.map(({ node }: any) => node)} columns={columns} />
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
