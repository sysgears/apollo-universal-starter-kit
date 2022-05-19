import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import { translate } from '@gqlapp/i18n-client-react';
import { PageLayout, Button } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

const Section = styled.section`
  text-align: center;
`;

const PageNotFound = ({ staticContext = {}, t }) => {
  staticContext.pageNotFound = true;
  return (
    <PageLayout>
      <Section>
        <Helmet
          title={`${settings.app.name} - ${t('title')}`}
          meta={[
            {
              name: 'description',
              content: `${settings.app.name} - ${t('meta')}`,
            },
          ]}
        />
        <h2>{t('content')} - 404</h2>
        <Link to="/">
          <Button className="home-link" color="primary">
            {t('btnHome')}
          </Button>
        </Link>
      </Section>
    </PageLayout>
  );
};

PageNotFound.propTypes = {
  staticContext: PropTypes.object,
  t: PropTypes.func,
};

export default translate('notFound')(PageNotFound);
