import React from 'react';

import { Button } from '../../../common/components/web';

class UsersActionsView extends React.Component {
  render() {
    return (
      <div className="clearfix">
        <div className="float-left">
          <h3>Users</h3>
        </div>
        <div className="float-right">
          <Button color="primary">Add</Button>
        </div>
      </div>
    );
  }
}

export default UsersActionsView;
