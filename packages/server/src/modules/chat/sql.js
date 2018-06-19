import { returnId } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Chat {
  message(id) {
    return knex
      .select('id', 'text', 'userId', 'created_at as createdAt')
      .from('message')
      .where('id', '=', id)
      .first();
  }

  getMessages() {
    return knex.select('id', 'text', 'userId', 'created_at as createdAt').from('message');
  }

  addMessage({ text, userId }) {
    return returnId(knex('message')).insert({ text, userId });
  }

  deleteMessage(id) {
    return knex('message')
      .where('id', '=', id)
      .del();
  }

  editMessage({ id, text, userId }) {
    return knex('message')
      .where('id', '=', id)
      .update({
        text: text,
        userId: userId
      });
  }
}
