import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CONTACTS = [
  { name: 'Tom Jackson', phone: '555-444-333', email: 'tom@gmail.com' },
  { name: 'Mike James', phone: '555-777-888', email: 'mikejames@gmail.com' },
  { name: 'Janet Larson', phone: '555-222-111', email: 'janetlarson@gmail.com' },
  { name: 'Clark Thompson', phone: '555-444-333', email: 'clark123@gmail.com' },
  { name: 'Emma Page', phone: '555-444-333', email: 'emma1page@gmail.com' }
];

const ContactRow = ({ contact: { name, phone, email } }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{phone}</td>
      <td>{email}</td>
    </tr>
  );
};

ContactRow.propTypes = {
  contact: PropTypes.object
};

const ContactTable = ({ contacts }) => {
  let rows = [];
  contacts.forEach((contact, key) => {
    rows.push(<ContactRow contact={contact} key={key} />);
  });
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

ContactTable.propTypes = {
  contacts: PropTypes.array
};

class ReportDemoPrint extends Component {
  render() {
    return (
      <div>
        <h1>React List Demo for Print</h1>
        <ContactTable contacts={CONTACTS} />
      </div>
    );
  }
}

export default ReportDemoPrint;
