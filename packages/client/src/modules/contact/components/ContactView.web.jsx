import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';

import ContactForm from './ContactForm';
import settings from '../../../../../../settings';

export default class ContactView extends React.Component {
  static propTypes = {
    contact: PropTypes.func.isRequired
  };

  state = {
    sent: false
  };

  onSubmit = ({ contact }) => async values => {
    const result = await contact(values);

    if (result.errors) {
      let submitError = {
        _error: 'Contact request failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }

    this.setState({ sent: result });
  };

  render() {
    const { contact } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - Contact Us`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Contact us example page`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Contact Us</h1>
          <ContactForm onSubmit={this.onSubmit({ contact })} sent={this.state.sent} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}
