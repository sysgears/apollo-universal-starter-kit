// Web only component

/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/page_layout';
import RegisterForm from '../components/register_form';

const onSubmit = (register) => (values) => {
  register(values);
};

const UserShow = ({ register }) => {

  const renderMetaData = () => (
    <Helmet
      title="Register"
      meta={[{
        name: 'description',
        content: 'Register page'
      }]}/>
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <h1>Register page!</h1>
        <RegisterForm onSubmit={onSubmit(register)} />
      </div>
    </PageLayout>
  );
};

UserShow.propTypes = {
  register: PropTypes.func.isRequired,
};

export default UserShow;
