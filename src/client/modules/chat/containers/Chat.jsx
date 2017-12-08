import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import ChatList from '../components/ChatList';

import CHATS_QUERY from '../graphql/ChatsQuery.graphql';
import CHATS_SUBSCRIPTION from '../graphql/ChatsSubscription.graphql';
import DELETE_CHAT from '../graphql/DeleteChat.graphql';

export function AddChat(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.chats.edges.some(chat => node.id === chat.cursor)) {
    return prev;
  }

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'ChatEdges'
  };

  return update(prev, {
    chats: {
      totalCount: {
        $set: prev.chats.totalCount + 1
      },
      edges: {
        $unshift: [edge]
      }
    }
  });
}

function DeleteChat(prev, id) {
  const index = prev.chats.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    chats: {
      totalCount: {
        $set: prev.chats.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]]
      }
    }
  });
}

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      const endCursor = this.props.chats ? this.props.chats.pageInfo.endCursor : 0;
      const nextEndCursor = nextProps.chats.pageInfo.endCursor;

      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && endCursor !== nextEndCursor) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToChatList(nextEndCursor);
      }
    }
  }

  subscribeToChatList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: CHATS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (prev, { subscriptionData: { data: { chatsUpdated: { mutation, node } } } }) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddChat(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteChat(prev, node.id);
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

  render() {
    return <ChatList {...this.props} />;
  }
}

Chat.propTypes = {
  loading: PropTypes.bool.isRequired,
  chats: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired
};

export default compose(
  graphql(CHATS_QUERY, {
    options: () => {
      return {
        variables: { limit: 10, after: 0 }
      };
    },
    props: ({ data }) => {
      const { loading, error, chats, fetchMore, subscribeToMore } = data;
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            after: chats.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.chats.totalCount;
            const newEdges = fetchMoreResult.chats.edges;
            const pageInfo = fetchMoreResult.chats.pageInfo;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              chats: {
                totalCount,
                edges: [...previousResult.chats.edges, ...newEdges],
                pageInfo,
                __typename: 'Chats'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, chats, subscribeToMore, loadMoreRows };
    }
  }),
  graphql(DELETE_CHAT, {
    props: ({ mutate }) => ({
      deleteChat: id => {
        mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteChat: {
              id: id,
              __typename: 'Chat'
            }
          },
          updateQueries: {
            chats: (prev, { mutationResult: { data: { deleteChat } } }) => {
              return DeleteChat(prev, deleteChat.id);
            }
          }
        });
      }
    })
  })
)(Chat);
