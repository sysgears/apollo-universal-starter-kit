import { TranslationFunction } from 'i18next';
import generator from './helpers/generator';
import ContactsDAO from '../sql';

interface ContactsContext {
  Contacts: ContactsDAO;
  req?: Request & { t: TranslationFunction };
}

export default () => ({
  Query: {
    async pdf(obj: any, arg: any, { Contacts, req }: ContactsContext) {
      const contacts = await Contacts.getContacts();
      const { t } = req;
      return generator(contacts, t);
    }
  }
});
