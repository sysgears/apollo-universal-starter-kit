import { User } from '../../modules/user/schema';
import KnexGenerator from '../../../common/DomainKnex';

exports.up = knex => new KnexGenerator(knex).createTables(User);

exports.down = knex => new KnexGenerator(knex).dropTables(User);
