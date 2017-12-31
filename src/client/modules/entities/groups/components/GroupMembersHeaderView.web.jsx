/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import MdAddBox from 'react-icons/lib/md/add-box';
import MdEdit from 'react-icons/lib/md/edit';
import MdDelete from 'react-icons/lib/md/delete';
import MdCancel from 'react-icons/lib/md/cancel';

import { Alert, Button, Form, FormItem, Input, Select, Option } from '../../../common/components/web';
import { required, email } from '../../../../../common/validation';

class GroupMembersHeaderView extends React.Component {
  static propTypes = {
    group: PropTypes.object.isRequired,
    onAddTriggered: PropTypes.func,
    onEditTriggered: PropTypes.func,
    onDeleteTriggered: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      showForm: false
    };
  }

  renderMemberForm = () => {
    let { error, group } = this.props;

    console.log('GROUP: ', group);
    return (
      <div id="member-form" style={{ marginBottom: '2rem' }}>
        <div className="clearfix">
          <Form name="group.member" layout="inline" className="float-left">
            &nbsp;
            <FormItem label="Email">
              <Input type="meal" id="email" name="email" placeholder="email" />
            </FormItem>
            &nbsp; &nbsp;
            <FormItem label="Role">
              <Select name="role">
                <Option key="none" value="">
                  Select ...
                </Option>
                {group.roles.map(role => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
            &nbsp;
          </Form>

          <Button
            style={{ marginRight: '24px' }}
            className="float-right"
            size="sm"
            color="danger"
            onClick={this.cancelMemberForm}
          >
            Cancel
          </Button>
          <Button
            style={{ marginRight: '24px' }}
            className="float-right"
            size="sm"
            color="primary"
            onClick={this.saveMemberForm}
          >
            Save
          </Button>
        </div>

        <div>{error && <Alert color="error">{error}</Alert>}</div>
      </div>
    );
  };

  showMemberForm = () => {
    this.setState({ showForm: true });
  };

  cancelMemberForm = () => {
    this.setState({ showForm: false });
  };

  saveMemberForm = () => {
    this.setState({ showForm: false });
  };

  render() {
    console.log('State:', this.state);

    const { group } = this.props;
    const { showForm } = this.state;

    return (
      <div>
        <div className="clearfix">
          <h3 className="float-left">{group.profile ? group.profile.displayName : group.name} - Members</h3>

          <h2 style={{ marginRight: '24px' }} className="float-right text-primary" onClick={this.showMemberForm}>
            <MdAddBox />
          </h2>
          <h2 style={{ marginRight: '24px' }} className="float-right text-primary">
            <MdEdit />
          </h2>
          <h2 style={{ marginRight: '24px' }} className="float-right text-primary">
            <MdDelete />
          </h2>
        </div>
        <hr />

        {showForm && this.renderMemberForm()}
      </div>
    );
  }
}

export default GroupMembersHeaderView;
