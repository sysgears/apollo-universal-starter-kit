import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';

import Page from '../../../app/page';
import POSTS_QUERY from '../graphql/posts_get.graphql';
import POSTS_SUBSCRIPTION from '../graphql/posts_subscription.graphql';
import POST_DELETE from '../graphql/post_delete.graphql';

export function AddPost(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.postsQuery.edges.some(post => node.id === post.cursor)) {
    return prev;
  }

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'PostEdges'
  };

  return update(prev, {
    postsQuery: {
      totalCount: {
        $set: prev.postsQuery.totalCount + 1
      },
      edges: {
        $unshift: [edge],
      }
    }
  });
}

function DeletePost(prev, id) {
  const index = prev.postsQuery.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    postsQuery: {
      totalCount: {
        $set: prev.postsQuery.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]],
      }
    }
  });
}

class PostList extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      const endCursor = this.props.postsQuery ? this.props.postsQuery.pageInfo.endCursor : 0;
      const nextEndCursor = nextProps.postsQuery.pageInfo.endCursor;

      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && endCursor !== nextEndCursor) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToPostList(nextEndCursor);
      }
    }
  }

  subscribeToPostList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (prev, { subscriptionData: { data: { postsUpdated: { mutation, node } } } }) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddPost(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeletePost(prev, node.id);
        }

        return newResult;
      }
    });
  };

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  renderPosts() {
    const { postsQuery, deletePost } = this.props;

    return postsQuery.edges.map(({ node: { id, title } }) => {
      return (
        <ListGroupItem className="justify-content-between" key={id}>
          <span><Link className="post-link" to={`/post/${id}`}>{title}</Link></span>
          <span className="badge badge-default badge-pill delete-button" onClick={deletePost(id)}>Delete</span>
        </ListGroupItem>
      );
    });
  }

  renderLoadMore() {
    const { postsQuery, loadMoreRows } = this.props;

    if (postsQuery.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  }

  renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Posts list"
      meta={[{
        name: 'description',
        content: 'List of all posts example page'
      }]}/>
  );

  render() {
    const { loading, postsQuery } = this.props;

    if (loading && !postsQuery) {
      return (
        <Page>
          <section>
            {this.renderMetaData()}
            <div>
              Loading...
            </div>
          </section>
        </Page>
      );
    } else {
      return (
        <Page>
          <section>
            {this.renderMetaData()}
            <h2>Posts</h2>
            <Link to="/post/add">
              <Button color="primary">Add</Button>
            </Link>
            <h1/>
            <ListGroup>
              {this.renderPosts()}
            </ListGroup>
            <div>
              <small>({postsQuery.edges.length} / {postsQuery.totalCount})</small>
            </div>
            {this.renderLoadMore()}
          </section>
        </Page>
      );
    }
  }
}

PostList.propTypes = {
  loading: PropTypes.bool.isRequired,
  postsQuery: PropTypes.object,
  deletePost: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};

export default compose(
  graphql(POSTS_QUERY, {
    options: () => {
      return {
        variables: { limit: 10, after: 0 },
      };
    },
    props: ({ data }) => {
      const { loading, postsQuery, fetchMore, subscribeToMore } = data;
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            after: postsQuery.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.postsQuery.totalCount;
            const newEdges = fetchMoreResult.postsQuery.edges;
            const pageInfo = fetchMoreResult.postsQuery.pageInfo;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              postsQuery: {
                totalCount,
                edges: [...previousResult.postsQuery.edges, ...newEdges],
                pageInfo,
                __typename: "PostsQuery"
              }
            };
          }
        });
      };

      return { loading, postsQuery, subscribeToMore, loadMoreRows };
    }
  }),
  graphql(POST_DELETE, {
    props: ({ mutate }) => ({
      deletePost(id) {
        return () => mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deletePost: {
              id: id,
              __typename: 'Post',
            },
          },
          updateQueries: {
            getPosts: (prev, { mutationResult: { data: { deletePost } } }) => {
              return DeletePost(prev, deletePost.id);
            }
          }
        });
      },
    })
  })
)(PostList);
