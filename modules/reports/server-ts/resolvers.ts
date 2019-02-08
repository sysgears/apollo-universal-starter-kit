import ContactsDAO from './sql';

export default () => ({
  Query: {
    async report(obj: any, arg: any, { Contacts }: { Contacts: ContactsDAO }) {
      return Contacts.getContacts();
    }
  }
});
