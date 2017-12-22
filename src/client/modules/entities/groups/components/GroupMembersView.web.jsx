import React from 'react';
import PropTypes from 'prop-types';

import GroupMembersFilter from '../containers/GroupMembersFilter';
import GroupMembersList from '../containers/GroupMembersList';

export default class GroupMembersView extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    return (
      <div>
        <GroupMembersFilter {...this.props} />
        <GroupMembersList {...this.props} />
      </div>
    );
  }
}
