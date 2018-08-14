import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo/index';
import update from 'immutability-helper';

import translate from '../../../i18n';
import MESSAGES_QUERY from '../graphql/MessagesQuery.graphql';
import ADD_MESSAGE from '../graphql/AddMessage.graphql';
import DELETE_MESSAGE from '../graphql/DeleteMessage.graphql';
import EDIT_MESSAGE from '../graphql/EditMessage.graphql';
import MESSAGES_SUBSCRIPTION from '../graphql/MessagesSubscription.graphql';
import { withUser } from '../../user/containers/AuthBase';
import withUuid from './WithUuid';
import ChatOperations from './ChatOperations';
import messageImage from './MessageImage';
import messagesFormatter from './MessagesFormatter';
import chatConfig from '../../../../../../config/chat';

function AddMessage(prev, node) {
  // ignore if duplicate
  if (prev.messages.edges.some(message => node.id === message.node.id)) {
    return prev;
  }

  const filteredMessages = prev.messages.edges.filter(message => message.node.id !== null);
  const edge = {
    cursor: prev.messages.totalCount,
    node: node,
    __typename: 'MessageEdges'
  };

  return update(prev, {
    messages: {
      totalCount: {
        $set: prev.messages.totalCount + 1
      },
      edges: {
        $set: [...filteredMessages, edge]
      },
      pageInfo: {
        endCursor: {
          $set: prev.messages.pageInfo.endCursor + 1
        }
      }
    }
  });
}

function DeleteMessage(prev, id) {
  const index = prev.messages.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  const filteredEdges = prev.messages.edges.filter((item, i) => i !== index);
  const updatedEdges = filteredEdges.map((item, i) => (item.cursor > index ? { ...item, cursor: i } : item));

  return update(prev, {
    messages: {
      totalCount: {
        $set: prev.messages.totalCount - 1
      },
      edges: {
        $set: updatedEdges
      },
      pageInfo: {
        endCursor: {
          $set: prev.messages.pageInfo.endCursor - 1
        }
      }
    }
  });
}

function EditMessage(prev, node) {
  const index = prev.messages.edges.findIndex(x => x.node.id === node.id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'MessageEdges'
  };

  return update(prev, {
    messages: {
      edges: {
        $splice: [[index, 1, edge]]
      }
    }
  });
}

class Chat extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    messages: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      const endCursor = this.props.messages ? this.props.messages.pageInfo.endCursor : 0;
      const prevEndCursor = prevProps.messages ? prevProps.messages.pageInfo.endCursor : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevEndCursor !== endCursor) {
        this.subscription();
        this.subscription = null;
      }
      if (!this.subscription) {
        this.subscribeToMessageList(endCursor);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToMessageList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              messagesUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;
        if (mutation === 'CREATED') {
          newResult = AddMessage(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteMessage(prev, node.id);
        } else if (mutation === 'UPDATED') {
          newResult = EditMessage(prev, node);
        }

        return newResult;
      }
    });
  };

  render() {
    return <ChatOperations {...this.props} />;
  }
}

export default compose(
  graphql(MESSAGES_QUERY, {
    options: () => {
      return {
        variables: { limit: chatConfig.limit, after: 0 }
      };
    },
    props: ({ data }) => {
      const { loading, error, messages, fetchMore, subscribeToMore } = data;
      const loadData = (after, dataDelivery) => {
        return fetchMore({
          variables: {
            after: after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.messages.totalCount;
            const newEdges = fetchMoreResult.messages.edges;
            const pageInfo = fetchMoreResult.messages.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...newEdges, ...previousResult.messages.edges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              messages: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'Messages'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, messages, subscribeToMore, loadData };
    }
  }),
  graphql(ADD_MESSAGE, {
    props: ({ mutate }) => ({
      addMessage: async ({ text, userId, username, uuid, quotedId, image, quotedMessage }) => {
        mutate({
          variables: { input: { text, uuid, quotedId, attachment: image } },
          updateQueries: {
            messages: (
              prev,
              {
                mutationResult: {
                  data: { addMessage }
                }
              }
            ) => {
              return AddMessage(prev, addMessage);
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addMessage: {
              __typename: 'Message',
              createdAt: new Date().toISOString(),
              text: text,
              username: username,
              userId: userId,
              uuid: uuid,
              id: null,
              quotedId: quotedId,
              quotedMessage: {
                __typename: 'QuotedMessage',
                ...quotedMessage
              },
              filename: image ? image.name : null,
              path: image ? image.uri : null
            }
          }
        });
      }
    })
  }),
  graphql(DELETE_MESSAGE, {
    props: ({ mutate }) => ({
      deleteMessage: id => {
        mutate({
          variables: id,
          optimisticResponse: {
            __typename: 'Mutation',
            deleteMessage: {
              id: id,
              __typename: 'Message'
            }
          },
          updateQueries: {
            messages: (
              prev,
              {
                mutationResult: {
                  data: { deleteMessage }
                }
              }
            ) => {
              return DeleteMessage(prev, deleteMessage.id);
            }
          }
        });
      }
    })
  }),
  graphql(EDIT_MESSAGE, {
    props: ({ mutate }) => ({
      editMessage: ({ text, id, createdAt, userId, username, uuid, quotedId, quotedMessage }) => {
        mutate({
          variables: { input: { text, id } },
          optimisticResponse: {
            __typename: 'Mutation',
            editMessage: {
              id: id,
              text: text,
              userId: userId,
              username: username,
              createdAt: createdAt.toISOString(),
              uuid: uuid,
              quotedId: quotedId,
              quotedMessage: {
                __typename: 'QuotedMessage',
                ...quotedMessage
              },
              filename: null,
              path: null,
              __typename: 'Message'
            }
          },
          updateQueries: {
            messages: (
              prev,
              {
                mutationResult: {
                  data: { editMessage }
                }
              }
            ) => {
              return EditMessage(prev, editMessage);
            }
          }
        });
      }
    })
  }),
  translate('chat'),
  withUuid,
  withUser,
  messageImage,
  messagesFormatter
)(Chat);
