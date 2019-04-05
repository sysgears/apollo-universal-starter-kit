import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { translate } from '@gqlapp/i18n-client-react';
import { PageLayout } from '@gqlapp/look-client-react';

import UserForm from './UserForm';
import settings from '../../../../settings';

const UserEditView = ({ loading, user, t, currentUser, onSubmit }) => {
  const isNotSelf = !user || (user && user.id !== currentUser.id);

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('userEdit.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('userEdit.meta')}`
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      {loading && !user ? (
        <div className="text-center">{t('userEdit.loadMsg')}</div>
      ) : (
        <>
          <Link id="back-button" to={currentUser && currentUser.role === 'admin' ? '/users' : '/profile'}>
            Back
          </Link>
          <h2>
            {t('userEdit.form.titleEdit')} {t('userEdit.form.title')}
          </h2>
          <UserForm
            onSubmit={onSubmit}
            shouldDisplayRole={isNotSelf}
            shouldDisplayActive={isNotSelf}
            initialValues={user}
          />
        </>
      )}
    </PageLayout>
  );
};

UserEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  currentUser: PropTypes.object,
  t: PropTypes.func,
  onSubmit: PropTypes.func
};

export default translate('user')(UserEditView);
