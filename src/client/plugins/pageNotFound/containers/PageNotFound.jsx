import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { PageLayout, Button } from '../../common/components/web';
import settings from '../../../../../settings';

const Section = styled.section`
  text-align: center;
`;

const PageNotFound = ({ staticContext = {} }) => {
  staticContext.pageNotFound = true;
  return (
    <PageLayout>
      <Section>
        <Helmet
          title={`${settings.app.name} - Page not found`}
          meta={[
            {
              name: 'description',
              content: `${settings.app.name} - Page not found`
            }
          ]}
        />
        <h2>Page not found - 404</h2>
        <Link to="/">
          <Button className="home-link" color="primary">
            Go to Homepage
          </Button>
        </Link>
      </Section>
    </PageLayout>
  );
};

PageNotFound.propTypes = {
  staticContext: PropTypes.object
};

export default PageNotFound;
