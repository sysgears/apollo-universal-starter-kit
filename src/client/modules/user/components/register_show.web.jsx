// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/page_layout';
import RegisterForm from '../components/register_form';

const onSubmit = (register) => (values) => {
  register(values);
};

const RegisterShow = ({ register }) => {

  const renderMetaData = () => (
    <Helmet
      title="Register"
      meta={[{
        name: 'description',
        content: 'Register page'
      }]} />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <h1>Register page!</h1>
      <RegisterForm onSubmit={onSubmit(register)} />
    </PageLayout>
  );
};

RegisterShow.propTypes = {
  register: PropTypes.func.isRequired,
};

export default RegisterShow;
