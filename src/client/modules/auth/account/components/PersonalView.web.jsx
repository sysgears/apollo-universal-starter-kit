import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import MdEdit from 'react-icons/lib/md/edit';

import { Card, CardGroup, CardTitle, CardText } from '../../../common/components/web';

import PersonalForm from '../containers/Personal';

class UserPersonal extends React.Component {
  render() {
    let { editing, user, onStartEdit, onCancelEdit } = this.props;

    if (!user || !user.profile) {
      return <NoView />;
    }

    return (
      <Card key="profile-personal">
        <CardGroup className="clearfix">
          <h3 className="float-right">{!editing && <MdEdit className="text-primary" onClick={onStartEdit()} />}</h3>
          <CardTitle>Personal Data:</CardTitle>

          {editing ? (
            <PersonalForm user={user} initialValues={user.profile} onCancel={onCancelEdit} />
          ) : (
            <View user={user} />
          )}
        </CardGroup>
      </Card>
    );
  }
}

const NoView = () => {
  return (
    <Card key="profile-personal">
      <CardGroup>
        <CardTitle>Personal Data:</CardTitle>
        <CardText>No personal data to show</CardText>
      </CardGroup>
    </Card>
  );
};

const View = ({ user }) => {
  const P = user.profile;

  return (
    <div>
      <CardText key="displayName">Display Name: {P.displayName}</CardText>
      <CardText key="fullName">
        Full Name: {P.title} {P.firstName} {P.middleName} {P.lastName} {P.suffix}
      </CardText>
      <CardText key="locale">
        Locale: {P.locale} {P.language}
      </CardText>
    </div>
  );
};
View.propTypes = {
  user: PropTypes.object
};

UserPersonal.propTypes = {
  user: PropTypes.object,
  editing: PropTypes.bool,
  onStartEdit: PropTypes.func,
  onCancelEdit: PropTypes.func
};

export default connect(
  state => {
    return {
      profile: state.profile,
      editing: state.profile.editingPersonal
    };
  },
  dispatch => ({
    onStartEdit() {
      return () =>
        dispatch({
          type: 'PERSONAL_EDIT_START',
          value: Boolean(true)
        });
    },
    onCancelEdit() {
      return () =>
        dispatch({
          type: 'PERSONAL_EDIT_CANCEL',
          value: Boolean(false)
        });
    }
  })
)(UserPersonal);
