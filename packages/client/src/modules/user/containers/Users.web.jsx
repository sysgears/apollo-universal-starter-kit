import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';

import settings from '../../../../../../settings';
import translate from '../../../i18n';
import UsersFilterView from '../components/UsersFilterView';
import { Button, PageLayout } from '../../common/components/web';
import UsersList from '../containers/UsersList';
import { withUsersState, withFilterUpdating } from './UserOperations';

const Users = props => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${props.t('users.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${props.t('users.meta')}`
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <h2>{props.t('users.list.title')}</h2>
      <Link to="/users/new">
        <Button color="primary">{props.t('users.btn.add')}</Button>
      </Link>
      <hr />
      <UsersFilterView {...props} />
      <hr />
      <UsersList />
    </PageLayout>
  );
};

Users.propTypes = {
  t: PropTypes.func
};

export default compose(
  withUsersState,
  withFilterUpdating
)(translate('user')(Users));
