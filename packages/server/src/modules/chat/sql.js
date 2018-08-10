import { orderedFor, returnId } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Chat {
  message(id) {
    return knex
      .select(
        'm.id',
        'm.text',
        'm.userId',
        'm.uuid',
        'u.username',
        'a.name',
        'a.path',
        'm.created_at as createdAt',
        'm.reply'
      )
      .from('message as m')
      .leftJoin('user as u', 'u.id', 'm.userId')
      .leftJoin('attachment as a', function() {
        this.on('a.message_id', '=', 'm.id');
      })
      .where('m.id', '=', id)
      .first();
  }

  async getQuatedMessages(messageIds) {
    const res = await knex
      .select('m.id', 'm.text', 'm.userId', 'u.username')
      .from('message as m')
      .leftJoin('user as u', 'u.id', 'm.userId')
      .whereIn('m.id', messageIds);

    return orderedFor(res, messageIds, 'id', true);
  }

  attachment(id) {
    return knex
      .select('id', 'name', 'type', 'size', 'path')
      .from('attachment')
      .where('message_id', '=', id)
      .first();
  }

  messagesPagination(limit, after) {
    return knex
      .select(
        'm.id',
        'm.text',
        'm.userId',
        'm.uuid',
        'u.username',
        'a.name',
        'a.path',
        'm.created_at as createdAt',
        'm.reply'
      )
      .from('message as m')
      .leftJoin('user as u', 'u.id', 'm.userId')
      .leftJoin('attachment as a', function() {
        this.on('a.message_id', '=', 'm.id');
      })
      .orderBy('m.id', 'desc')
      .limit(limit)
      .offset(after);
  }

  getTotal() {
    return knex('message')
      .countDistinct('id as count')
      .first();
  }

  addMessage({ text, userId, uuid, reply }) {
    return returnId(knex('message')).insert({ text, userId, uuid, reply });
  }

  addMessageWithAttachment({ text, userId, uuid, reply, attachment }) {
    return knex.transaction(trx => {
      knex('message')
        .transacting(trx)
        .insert({ text, userId, uuid, reply })
        .then(resp => {
          const id = resp[0];
          return knex('attachment')
            .transacting(trx)
            .insert({ ...attachment, message_id: id })
            .then(() => [id]);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
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
