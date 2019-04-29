import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';

import { translate } from '@gqlapp/i18n-client-react';
import { Button, PageLayout } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import UsersFilterView from '../components/UsersFilterView';
import UsersListView from '../components/UsersListView';
import { useUsersWithSubscription } from './withSubscription';
import {
  withFilterUpdating,
  withOrderByUpdating,
  withUsers,
  withUsersDeleting,
  withUsersState,
  updateUsersState
} from './UserOperations';

const Users = props => {
  const { t, updateQuery, subscribeToMore, filter } = props;
  const usersUpdated = useUsersWithSubscription(subscribeToMore, filter);

  useEffect(() => {
    if (usersUpdated) {
      updateUsersState(usersUpdated, updateQuery);
    }
  });

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
      <Link to="/users/new">
        <Button color="primary">{t('users.btn.add')}</Button>
      </Link>
      <hr />
      <UsersFilterView {...props} />
      <hr />
      <UsersListView {...props} />
    </PageLayout>
  );
};

Users.propTypes = {
  usersUpdated: PropTypes.object,
  updateQuery: PropTypes.func,
  t: PropTypes.func,
  subscribeToMore: PropTypes.func,
  filter: PropTypes.object
};

export default compose(
  withUsersState,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating,
  withFilterUpdating
)(translate('user')(Users));
