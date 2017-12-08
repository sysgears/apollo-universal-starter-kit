import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../testHelpers/integrationSetup';
import CHATS_QUERY from '../../../client/modules/chat/graphql/ChatsQuery.graphql';
import CHAT_QUERY from '../../../client/modules/chat/graphql/ChatQuery.graphql';
import ADD_CHAT from '../../../client/modules/chat/graphql/AddChat.graphql';
import EDIT_CHAT from '../../../client/modules/chat/graphql/EditChat.graphql';
import DELETE_CHAT from '../../../client/modules/chat/graphql/DeleteChat.graphql';
import CHATS_SUBSCRIPTION from '../../../client/modules/chat/graphql/ChatsSubscription.graphql';

describe('Chat and messages example API works', () => {
  let apollo;

  before(() => {
    apollo = getApollo();
  });

  step('Query chat list works', async () => {
    let result = await apollo.query({
      query: CHATS_QUERY,
      variables: { limit: 1, after: 0 }
    });

    expect(result.data).to.deep.equal({
      chats: {
        totalCount: 20,
        edges: [
          {
            cursor: 20,
            node: {
              id: 20,
              title: 'Chat title 20',
              content: 'Chat content 20',
              __typename: 'Chat'
            },
            __typename: 'ChatEdges'
          }
        ],
        pageInfo: {
          endCursor: 20,
          hasNextPage: true,
          __typename: 'ChatPageInfo'
        },
        __typename: 'Chats'
      }
    });
  });

  step('Query single chat with messages works', async () => {
    let result = await apollo.query({ query: CHAT_QUERY, variables: { id: 1 } });

    expect(result.data).to.deep.equal({
      chat: {
        id: 1,
        title: 'Chat title 1',
        content: 'Chat content 1',
        __typename: 'Chat',
        messages: [
          {
            id: 1,
            content: 'Message title 1 for chat 1',
            __typename: 'Message'
          },
          {
            id: 2,
            content: 'Message title 2 for chat 1',
            __typename: 'Message'
          }
        ]
      }
    });
  });

  step('Publishes chat on add', done => {
    apollo.mutate({
      mutation: ADD_CHAT,
      variables: {
        input: {
          title: 'New chat 1',
          content: 'New chat content 1'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: CHATS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              chatsUpdated: {
                mutation: 'CREATED',
                node: {
                  id: 21,
                  title: 'New chat 1',
                  content: 'New chat content 1',
                  __typename: 'Chat'
                },
                __typename: 'UpdateChatPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Adding chat works', async () => {
    let result = await apollo.query({
      query: CHATS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.chats).to.have.property('totalCount', 21);
    expect(result.data.chats).to.have.nested.property('edges[0].node.title', 'New chat 1');
    expect(result.data.chats).to.have.nested.property('edges[0].node.content', 'New chat content 1');
  });

  step('Publishes chat on update', done => {
    apollo.mutate({
      mutation: EDIT_CHAT,
      variables: {
        input: {
          id: 21,
          title: 'New chat 2',
          content: 'New chat content 2'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: CHATS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              chatsUpdated: {
                mutation: 'UPDATED',
                node: {
                  id: 21,
                  title: 'New chat 2',
                  content: 'New chat content 2',
                  __typename: 'Chat'
                },
                __typename: 'UpdateChatPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Updating chat works', async () => {
    let result = await apollo.query({
      query: CHATS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.chats).to.have.property('totalCount', 21);
    expect(result.data.chats).to.have.nested.property('edges[0].node.title', 'New chat 2');
    expect(result.data.chats).to.have.nested.property('edges[0].node.content', 'New chat content 2');
  });

  step('Publishes chat on removal', done => {
    apollo.mutate({
      mutation: DELETE_CHAT,
      variables: { id: '21' }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: CHATS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              chatsUpdated: {
                mutation: 'DELETED',
                node: {
                  id: 21,
                  title: 'New chat 2',
                  content: 'New chat content 2',
                  __typename: 'Chat'
                },
                __typename: 'UpdateChatPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Deleting chat works', async () => {
    let result = await apollo.query({
      query: CHATS_QUERY,
      variables: { limit: 2, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.chats).to.have.property('totalCount', 20);
    expect(result.data.chats).to.have.nested.property('edges[0].node.title', 'Chat title 20');
    expect(result.data.chats).to.have.nested.property('edges[0].node.content', 'Chat content 20');
  });
});
