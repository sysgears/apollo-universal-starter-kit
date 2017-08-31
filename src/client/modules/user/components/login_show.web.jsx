// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/page_layout';
import LoginForm from '../components/login_form';

const onSubmit = (login) => (values) => {
  login(values);
};

const UserShow = ({ login }) => {

  const renderMetaData = () => (
    <Helmet
      title="Login"
      meta={[{
        name: 'description',
        content: 'Login page'
      }]}/>
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <h1>Login page!</h1>
        <LoginForm onSubmit={onSubmit(login)} />
      </div>
    </PageLayout>
  );
};

UserShow.propTypes = {
  login: PropTypes.func.isRequired,
};

export default UserShow;
