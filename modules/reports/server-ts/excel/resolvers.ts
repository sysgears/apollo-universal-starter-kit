import generateExcel from './helpers/generateExcel';
import ContactsDAO from '../sql';

export default () => ({
  Query: {
    async excel(obj: any, arg: any, { Contacts }: { Contacts: ContactsDAO }) {
      const contacts = await Contacts.getContacts();
      return generateExcel(contacts);
    }
  }
});
