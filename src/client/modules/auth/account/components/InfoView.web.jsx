import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Card, CardGroup, CardTitle, CardText } from '../../../common/components/web';

class UserInfo extends React.Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    let { user } = this.props;

    if (!user) {
      return <NoView />;
    } else {
      return <View user={user} />;
    }
  }
}

const NoView = () => {
  return (
    <Card key="user-info">
      <CardGroup>
        <CardTitle>Info:</CardTitle>
        <CardText>Nothing to see here</CardText>
      </CardGroup>
    </Card>
  );
};

const View = ({ user }) => {
  return (
    <Card key="user-info">
      <CardGroup>
        <CardTitle>Info:</CardTitle>
        <CardText key="userId">User ID: {user.id}</CardText>
        <CardText>Email: {user.email}</CardText>
        <CardText>
          User Roles:
          {user.userRoles && (
            <span>
              {' '}
              [{' '}
              {user.userRoles.map(r => {
                return (
                  <Link to={'/roles/' + r.id}>
                    {' '}
                    {r.name} {r.id != user.userRoles[0].id ? ',' : ''}{' '}
                  </Link>
                );
              })}{' '}
              ]{' '}
            </span>
          )}
        </CardText>
      </CardGroup>
    </Card>
  );
};

View.propTypes = {
  user: PropTypes.object.isRequired
};

UserInfo.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserInfo;
