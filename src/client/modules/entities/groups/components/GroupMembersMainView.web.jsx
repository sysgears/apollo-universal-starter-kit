/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import GroupMembersHeaderView from './GroupMembersHeaderView';
import GroupMembersTableView from './GroupMembersTableView';

export default class GroupMembersView extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    const { group } = this.props;
    return (
      <div>
        <GroupMembersHeaderView {...this.props} />
        <GroupMembersTableView {...this.props} />
      </div>
    );
  }
}
