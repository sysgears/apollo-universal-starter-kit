import { returnId } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Chat {
  message(id) {
    return knex
      .select('id', 'text', 'userId', 'uuid', 'created_at as createdAt', 'reply')
      .from('message')
      .where('id', '=', id)
      .first();
  }

  getMessages() {
    return knex
      .select('m.id', 'm.text', 'm.userId', 'm.uuid', 'u.username', 'm.created_at as createdAt', 'm.reply')
      .from('message as m')
      .leftJoin('user as u', 'u.id', 'm.userId')
      .orderBy('m.id', 'desc');
  }

  addMessage({ text, userId, uuid, reply }) {
    return returnId(knex('message')).insert({ text, userId, uuid, reply });
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
