import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import UsersFilter from '../containers/UsersFilter';
import UsersList from '../containers/UsersList';
import { PageLayout, Button } from '../../common/components/web';

import settings from '../../../../../../settings';

const Users = ({ t }) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('users.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('users.meta')}`
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <h2>{t('users.list.title')}</h2>
      <Link to="/users/0">
        <Button color="primary">{t('users.btn.add')}</Button>
      </Link>
      <hr />
      <UsersFilter />
      <hr />
      <UsersList />
    </PageLayout>
  );
};

Users.propTypes = {
  t: PropTypes.func
};

export default translate('user')(Users);
