import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';

import ContactView from '../components/ContactView';

import CONTACT from '../graphql/Contact.graphql';
import translate from '../../../i18n';

class Contact extends React.Component {
  static propTypes = {
    contact: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = async values => {
    const { contact, t } = this.props;
    const result = await contact(values);

    // set general error message if server has an error
    if (!result) {
      throw { _error: t('errorMsg') };
    }

    // set custom errors
    if (result && result.errors) {
      throw result.errors.reduce((res, error) => {
        res[error.field] = error.message;
        return res;
      }, {});
    }
  };

  render() {
    return <ContactView {...this.props} onSubmit={this.onSubmit} />;
  }
}

export default compose(
  graphql(CONTACT, {
    props: ({ mutate }) => ({
      contact: async ({ name, email, content }) => {
        try {
          const {
            data: { contact }
          } = await mutate({ variables: { input: { name, email, content } } });

          if (contact.errors) {
            return { errors: contact.errors };
          }

          return contact;
        } catch (e) {
          console.log(e.graphQLErrors);
          return false;
        }
      }
    })
  })
)(translate('contact')(Contact));
