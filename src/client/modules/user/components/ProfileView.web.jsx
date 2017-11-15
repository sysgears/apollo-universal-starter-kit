import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Table } from 'reactstrap';
import { Container, Row, Col, PageLayout } from '../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Profile"
    meta={[
      {
        name: 'description',
        content: 'Profile page'
      }
    ]}
  />
);

const ProfileView = ({ loading, currentUser }) => {
  if (loading && !currentUser) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else if (currentUser) {
    return (
      <PageLayout>
        {renderMetaData()}
        <Container>
          <Row>
            <Col xs={{ size: 6, offset: 3 }}>
              <Row>
                <Col>
                  <h1 className="text-center">Profile</h1>
                  <Table bordered style={{ marginTop: 16 }}>
                    <tbody>
                      <tr>
                        <td>User Name:</td>
                        <td>{currentUser.username}</td>
                      </tr>
                      <tr>
                        <td>Email:</td>
                        <td>{currentUser.email}</td>
                      </tr>
                      <tr>
                        <td>Role:</td>
                        <td>{currentUser.role}</td>
                      </tr>
                      {currentUser.profile &&
                        currentUser.profile.fullName && (
                          <tr>
                            <td>Full Name:</td>
                            <td>{currentUser.profile.fullName}</td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <h2>No current user logged in</h2>
      </PageLayout>
    );
  }
};

ProfileView.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object
};

export default ProfileView;
