import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';

const pageNotFound = () => (
  <section className="text-center mt-4 mb-4">
    <Helmet
      title='Apollo Starter Kit - Page not found'
      meta={[{
        name: 'description',
        content: 'Apollo Starter Kit - Page not found'
      }]}/>
    <h2><FormattedMessage {...messages.header} /></h2>
    <Link to="/">
      <Button className='home-link' color="primary">Go to Homepage</Button>
    </Link>
  </section>
);

export default pageNotFound;
