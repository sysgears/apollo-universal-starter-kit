import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Button } from '../../common/components/web';

import $Module$Filter from '../containers/$Module$Filter';
import $Module$List from '../containers/$Module$List';
import settings from '../../../../../settings';

const $Module$ = () => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - $Module$`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - $Module$ page`
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <h2>$Module$</h2>
      <Link to="/$module$/0">
        <Button color="primary">Add</Button>
      </Link>
      <hr />
      <$Module$Filter />
      <hr />
      <$Module$List />
    </PageLayout>
  );
};

export default $Module$;
