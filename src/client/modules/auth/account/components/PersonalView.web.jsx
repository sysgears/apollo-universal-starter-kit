import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import MdEdit from 'react-icons/lib/md/edit';
import MdCancel from 'react-icons/lib/md/cancel';

import { Card, CardGroup, CardTitle, CardText } from '../../../common/components/web';
import ObjectView from '../../../common/components/hoc/editable/object/View';

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
          <h3 className="float-right">
            {editing ? (
              <MdCancel className="text-danger" onClick={onCancelEdit()} />
            ) : (
              <MdEdit className="text-primary" onClick={onStartEdit()} />
            )}
          </h3>
          <CardTitle>Personal Data:</CardTitle>
          <br />

          {editing ? (
            <PersonalForm user={user} initialValues={user.profile} onCancel={onCancelEdit} />
          ) : (
            <ObjectView
              object={user.profile}
              fields={['displayName', 'title', 'firstName', 'middleName', 'lastName', 'suffix', 'language', 'locale']}
            />
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
