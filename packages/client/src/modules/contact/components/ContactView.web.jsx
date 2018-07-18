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
    onSubmit: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  state = {
    sent: false
  };

  render() {
    const { onSubmit, t } = this.props;

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
          <ContactForm onSubmit={onSubmit} sent={this.state.sent} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('contact')(ContactView);
