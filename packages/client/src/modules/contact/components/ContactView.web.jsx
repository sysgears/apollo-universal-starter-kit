import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import translate from '../../../i18n';
import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';
import ContactForm from './ContactForm';
import settings from '../../../../../../settings';

class ContactView extends React.Component {
  static propTypes = {
    contact: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  state = {
    sent: false
  };

  onSubmit = ({ contact, t }) => async values => {
    const result = await contact(values);

    if (result.errors) {
      let submitError = {
        _error: t('errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }

    this.setState({ sent: result });
  };

  render() {
    const { contact, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - ${t('title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">{t('form.title')}</h1>
          <ContactForm onSubmit={this.onSubmit({ contact, t })} sent={this.state.sent} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('contact')(ContactView);
