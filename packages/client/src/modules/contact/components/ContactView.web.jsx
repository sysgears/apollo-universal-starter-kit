import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';
import ContactForm from './ContactForm';
import settings from '../../../../../../settings';

const ContactView = props => {
  const { t } = props;

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
        <ContactForm {...props} />
      </LayoutCenter>
    </PageLayout>
  );
};

ContactView.propTypes = {
  t: PropTypes.func
};

export default ContactView;
