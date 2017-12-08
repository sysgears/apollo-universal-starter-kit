import { expect } from 'chai';
import { step } from 'mocha-steps';
import _ from 'lodash';

import Renderer from '../../../../client/testHelpers/Renderer';
import CHATS_SUBSCRIPTION from '../graphql/ChatsSubscription.graphql';
import CHAT_SUBSCRIPTION from '../graphql/ChatSubscription.graphql';
import MESSAGE_SUBSCRIPTION from '../graphql/MessageSubscription.graphql';

const createNode = id => ({
  id: `${id}`,
  title: `Chat title ${id}`,
  content: `Chat content ${id}`,
  messages: [
    { id: id * 1000 + 1, content: 'Chat message 1', __typename: 'Message' },
    { id: id * 1000 + 2, content: 'Chat message 2', __typename: 'Message' }
  ],
  __typename: 'Chat'
});

const mutations = {
  editChat: true,
  addMessage: true,
  editMessage: true
};

const mocks = {
  Query: () => ({
    chats(ignored, { after }) {
      const totalCount = 4;
      const edges = [];
      for (let i = +after + 1; i <= +after + 2; i++) {
        edges.push({
          cursor: i,
          node: createNode(i),
          __typename: 'ChatEdges'
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true,
          __typename: 'ChatPageInfo'
        },
        __typename: 'Chats'
      };
    },
    chat(obj, { id }) {
      return createNode(id);
    }
  }),
  Mutation: () => ({
    deleteChat: (obj, { id }) => createNode(id),
    deleteMessage: (obj, { input }) => input,
    ...mutations
  })
};

describe('Chats and messages example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let content;

  beforeEach(() => {
    // Reset spy mutations on each step
    Object.keys(mutations).forEach(key => delete mutations[key]);
    if (app) {
      app.update();
      content = app.find('#content').last();
    }
  });

  step('Chats page renders without data', () => {
    app = renderer.mount();
    content = app.find('#content').last();
    renderer.history.push('/chats');

    content.text().should.equal('Loading...');
  });

  step('Chats page renders with data', () => {
    expect(content.text()).to.include('Chat title 1');
    expect(content.text()).to.include('Chat title 2');
    expect(content.text()).to.include('2 / 4');
  });

  step('Clicking load more works', () => {
    const loadMoreButton = content.find('#load-more').last();
    loadMoreButton.simulate('click');
  });

  step('Clicking load more loads more chats', () => {
    expect(content.text()).to.include('Chat title 3');
    expect(content.text()).to.include('Chat title 4');
    expect(content.text()).to.include('4 / 4');
  });

  step('Check subscribed to chat list updates', () => {
    expect(renderer.getSubscriptions(CHATS_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates chat list on chat delete from subscription', () => {
    const subscription = renderer.getSubscriptions(CHATS_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        chatsUpdated: {
          mutation: 'DELETED',
          node: createNode(2),
          __typename: 'UpdateChatPayload'
        }
      }
    });

    expect(content.text()).to.not.include('Chat title 2');
    expect(content.text()).to.include('3 / 3');
  });

  step('Updates chat list on chat create from subscription', () => {
    const subscription = renderer.getSubscriptions(CHATS_SUBSCRIPTION)[0];
    subscription.next(
      _.cloneDeep({
        data: {
          chatsUpdated: {
            mutation: 'CREATED',
            node: createNode(2),
            __typename: 'UpdateChatPayload'
          }
        }
      })
    );

    expect(content.text()).to.include('Chat title 2');
    expect(content.text()).to.include('4 / 4');
  });

  step('Clicking delete optimistically removes chat', () => {
    mutations.deleteChat = (obj, { id }) => {
      return createNode(id);
    };

    const deleteButtons = content.find('.delete-button');
    expect(deleteButtons).has.lengthOf(12);
    deleteButtons.last().simulate('click');

    expect(content.text()).to.not.include('Chat title 4');
    expect(content.text()).to.include('3 / 3');
  });

  step('Clicking delete removes the chat', () => {
    expect(content.text()).to.include('Chat title 3');
    expect(content.text()).to.not.include('Chat title 4');
    expect(content.text()).to.include('3 / 3');
  });

  step('Clicking on chat works', () => {
    const chatLinks = content.find('.chat-link');
    chatLinks.last().simulate('click', { button: 0 });
  });

  step('Clicking on chat opens chat form', () => {
    const chatForm = content.find('form[name="chat"]');

    expect(content.text()).to.include('Edit Chat');
    expect(
      chatForm
        .find('[name="title"]')
        .last()
        .instance().value
    ).to.equal('Chat title 3');
    expect(
      chatForm
        .find('[name="content"]')
        .last()
        .instance().value
    ).to.equal('Chat content 3');
  });

  step('Check subscribed to chat updates', () => {
    expect(renderer.getSubscriptions(CHAT_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates chat form on chat updated from subscription', () => {
    const subscription = renderer.getSubscriptions(CHAT_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        chatUpdated: {
          id: '3',
          title: 'Chat title 203',
          content: 'Chat content 204',
          __typename: 'Chat'
        }
      }
    });
    const chatForm = content.find('form[name="chat"]');

    expect(
      chatForm
        .find('[name="title"]')
        .last()
        .instance().value
    ).to.equal('Chat title 203');
    expect(
      chatForm
        .find('[name="content"]')
        .last()
        .instance().value
    ).to.equal('Chat content 204');
  });

  step('Chat editing form works', done => {
    mutations.editChat = (obj, { input }) => {
      expect(input.id).to.equal(3);
      expect(input.title).to.equal('Chat title 33');
      expect(input.content).to.equal('Chat content 33');
      done();
      return input;
    };

    const chatForm = app.find('form[name="chat"]').last();
    chatForm
      .find('[name="title"]')
      .last()
      .simulate('change', { target: { value: 'Chat title 33' } });
    chatForm
      .find('[name="content"]')
      .last()
      .simulate('change', { target: { value: 'Chat content 33' } });
    chatForm.simulate('submit');
  });

  step('Check opening chat by URL', () => {
    renderer.history.push('/chat/3');
  });

  step('Opening chat by URL works', () => {
    const chatForm = content.find('form[name="chat"]');

    expect(content.text()).to.include('Edit Chat');
    expect(
      chatForm
        .find('[name="title"]')
        .at(0)
        .instance().value
    ).to.equal('Chat title 33');
    expect(
      chatForm
        .find('[name="content"]')
        .at(0)
        .instance().value
    ).to.equal('Chat content 33');
    expect(content.text()).to.include('Edit Chat');
  });

  step('Message adding works', done => {
    mutations.addMessage = (obj, { input }) => {
      expect(input.chatId).to.equal(3);
      expect(input.content).to.equal('Chat message 24');
      done();
      return input;
    };

    const messageForm = content.find('form[name="message"]');
    messageForm
      .find('[name="content"]')
      .last()
      .simulate('change', { target: { value: 'Chat message 24' } });
    messageForm.last().simulate('submit');
    expect(content.text()).to.include('Chat message 24');
  });

  step('Updates message form on message added got from subscription', () => {
    const subscription = renderer.getSubscriptions(MESSAGE_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        messageUpdated: {
          mutation: 'CREATED',
          id: 3003,
          chatId: 3,
          node: {
            id: 3003,
            content: 'Chat message 3',
            __typename: 'Message'
          },
          __typename: 'UpdateMessagePayload'
        }
      }
    });

    expect(content.text()).to.include('Chat message 3');
  });

  step('Updates message form on message deleted got from subscription', () => {
    const subscription = renderer.getSubscriptions(MESSAGE_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        messageUpdated: {
          mutation: 'DELETED',
          id: 3003,
          chatId: 3,
          node: {
            id: 3003,
            content: 'Chat message 3',
            __typename: 'Message'
          },
          __typename: 'UpdateMessagePayload'
        }
      }
    });
    expect(content.text()).to.not.include('Chat message 3');
  });

  step('Message deleting optimistically removes message', () => {
    const deleteButtons = content.find('.delete-message');
    expect(deleteButtons).has.lengthOf(9);
    deleteButtons.last().simulate('click');

    app.update();
    content = app.find('#content').last();
    expect(content.text()).to.not.include('Chat message 24');
    expect(content.find('.delete-message')).has.lengthOf(6);
  });

  step('Clicking message delete removes the message', () => {
    expect(content.text()).to.not.include('Chat message 24');
    expect(content.find('.delete-message')).has.lengthOf(6);
  });

  step('Message editing works', done => {
    mutations.editMessage = (obj, { input }) => {
      expect(input.chatId).to.equal(3);
      expect(input.content).to.equal('Edited message 2');
      done();
      return input;
    };

    const editButtons = content.find('.edit-message');
    expect(editButtons).has.lengthOf(6);
    editButtons.last().simulate('click');

    const messageForm = content.find('form[name="message"]');
    expect(
      messageForm
        .find('[name="content"]')
        .last()
        .instance().value
    ).to.equal('Chat message 2');
    messageForm
      .find('[name="content"]')
      .last()
      .simulate('change', { target: { value: 'Edited message 2' } });
    messageForm.last().simulate('submit');

    expect(content.text()).to.include('Edited message 2');
  });

  step('Clicking back button takes to chat list', () => {
    const backButton = content.find('#back-button');
    backButton.last().simulate('click', { button: 0 });
    app.update();
    content = app.find('#content').last();
    expect(content.text()).to.include('Chat title 3');
  });
});
