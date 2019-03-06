/*tslint:disable:variable-name*/
import { knex, orderedFor, returnId } from '@gqlapp/database-server-ts';
import { UploadedFile } from '@gqlapp/upload-server-ts';

export interface Identifier {
  id: number;
}

export type Message = {
  text: string;
  userId: number;
  uuid: string;
  username: string;
  filename: string;
  path: string;
  createdAt: string;
  quotedId: string;
} & Identifier;

interface AddMessageParams {
  text: string;
  userId: number;
  uuid: string;
  quotedId: number;
  attachment?: UploadedFile;
}

export default class ChatDAO {
  public message(id: number) {
    return knex
      .select(
        'm.id',
        'm.text',
        'm.user_id as userId',
        'm.uuid',
        'u.username',
        'a.name as filename',
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

  public async getQuatedMessages(messageIds: number[]) {
    const res = await knex
      .select('m.id', 'm.text', 'm.user_id as userId', 'u.username', 'a.name as filename', 'a.path')
      .from('message as m')
      .leftJoin('attachment as a', function() {
        this.on('a.message_id', '=', 'm.id');
      })
      .leftJoin('user as u', 'u.id', 'm.user_id')
      .whereIn('m.id', messageIds);

    return orderedFor(res, messageIds, 'id', true);
  }

  public attachment(id: number) {
    return knex
      .select('id', 'name as filename', 'type', 'size', 'path')
      .from('attachment')
      .where('message_id', '=', id)
      .first();
  }

  public messagesPagination(limit: number, after: number) {
    return knex
      .select(
        'm.id',
        'm.text',
        'm.user_id as userId',
        'm.uuid',
        'u.username',
        'a.name as filename',
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

  public getTotal() {
    return knex('message')
      .countDistinct('id as count')
      .first();
  }

  public addMessage({ text, userId: user_id, uuid, quotedId: quoted_id }: AddMessageParams) {
    return returnId(knex('message')).insert({ text, user_id, uuid, quoted_id });
  }

  public addMessageWithAttachment({ text, userId: user_id, uuid, quotedId: quoted_id, attachment }: AddMessageParams) {
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

  public deleteMessage(id: number) {
    return knex('message')
      .where('id', '=', id)
      .del();
  }

  public editMessage({ id, text, userId: user_id }: { text: string; userId: number } & Identifier) {
    return knex('message')
      .where('id', '=', id)
      .update({
        text,
        user_id
      });
  }
}
