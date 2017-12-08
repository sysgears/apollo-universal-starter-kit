import _ from 'lodash';
import knex from '../../sql/connector';

const orderedFor = (rows, collection, field, singleObject) => {
  // return the rows ordered for the collection
  const inGroupsOfField = _.groupBy(rows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export default class Chat {
  chatsPagination(limit, after) {
    let where = '';
    if (after > 0) {
      where = `id < ${after}`;
    }

    return knex
      .select('id', 'title', 'content')
      .from('chat')
      .whereRaw(where)
      .orderBy('id', 'desc')
      .limit(limit);
  }

  async getMessagesForChatIds(chatIds) {
    let res = await knex
      .select('id', 'content', 'chat_id AS chatId')
      .from('message')
      .whereIn('chat_id', chatIds);

    return orderedFor(res, chatIds, 'chatId', false);
  }

  getTotal() {
    return knex('chat')
      .countDistinct('id as count')
      .first();
  }

  getNextPageFlag(id) {
    return knex('chat')
      .countDistinct('id as count')
      .where('id', '<', id)
      .first();
  }

  chat(id) {
    return knex
      .select('id', 'title', 'content')
      .from('chat')
      .where('id', '=', id)
      .first();
  }

  addChat({ title, content }) {
    return knex('chat')
      .insert({ title, content })
      .returning('id');
  }

  deleteChat(id) {
    return knex('chat')
      .where('id', '=', id)
      .del();
  }

  editChat({ id, title, content }) {
    return knex('chat')
      .where('id', '=', id)
      .update({
        title: title,
        content: content
      });
  }

  addMessage({ content, chatId }) {
    return knex('message')
      .insert({ content, chat_id: chatId })
      .returning('id');
  }

  getMessage(id) {
    return knex
      .select('id', 'content')
      .from('message')
      .where('id', '=', id)
      .first();
  }

  deleteMessage(id) {
    return knex('message')
      .where('id', '=', id)
      .del();
  }

  editMessage({ id, content }) {
    return knex('message')
      .where('id', '=', id)
      .update({
        content: content
      });
  }
}
