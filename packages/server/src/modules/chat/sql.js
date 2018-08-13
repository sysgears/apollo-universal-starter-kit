import { orderedFor, returnId } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Chat {
  message(id) {
    return knex
      .select(
        'm.id',
        'm.text',
        'm.user_id as userId',
        'm.uuid',
        'u.username',
        'a.filename',
        'a.path',
        'm.created_at as createdAt',
        'm.quoted_id as quotedId'
      )
      .from('message as m')
      .leftJoin('user as u', 'u.id', 'm.user_id')
      .leftJoin('attachment as a', function() {
        this.on('a.message_id', '=', 'm.id');
      })
      .where('m.id', '=', id)
      .first();
  }

  async getQuatedMessages(messageIds) {
    const res = await knex
      .select('m.id', 'm.text', 'm.user_id as userId', 'u.username', 'a.filename', 'a.path')
      .from('message as m')
      .leftJoin('attachment as a', function() {
        this.on('a.message_id', '=', 'm.id');
      })
      .leftJoin('user as u', 'u.id', 'm.user_id')
      .whereIn('m.id', messageIds);

    return orderedFor(res, messageIds, 'id', true);
  }

  attachment(id) {
    return knex
      .select('id', 'filename', 'type', 'size', 'path')
      .from('attachment')
      .where('message_id', '=', id)
      .first();
  }

  messagesPagination(limit, after) {
    return knex
      .select(
        'm.id',
        'm.text',
        'm.user_id as userId',
        'm.uuid',
        'u.username',
        'a.filename',
        'a.path',
        'm.created_at as createdAt',
        'm.quoted_id as quotedId'
      )
      .from('message as m')
      .leftJoin('user as u', 'u.id', 'm.user_id')
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

  addMessage({ text, userId: user_id, uuid, quotedId: quoted_id }) {
    return returnId(knex('message')).insert({ text, user_id, uuid, quoted_id });
  }

  addMessageWithAttachment({ text, userId: user_id, uuid, quotedId: quoted_id, attachment }) {
    return knex.transaction(trx => {
      knex('message')
        .transacting(trx)
        .insert({ text, user_id, uuid, quoted_id })
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

  editMessage({ id, text, userId: user_id }) {
    return knex('message')
      .where('id', '=', id)
      .update({
        text,
        user_id
      });
  }
}
