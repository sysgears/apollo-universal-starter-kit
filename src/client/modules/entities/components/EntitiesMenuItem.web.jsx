import React from 'react';
import { Link } from 'react-router-dom';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '../../common/components/web';

import settings from '../../../../../settings';

const config = settings.entities;

export default class EntitiesMenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color="white" caret>
          Entities
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link to="/entities">Dashboard</Link>
          </DropdownItem>
          <DropdownItem divider />
          {config.orgs.enabled && (
            <DropdownItem>
              <Link to="/orgs">Orgs</Link>
            </DropdownItem>
          )}
          {config.groups.enabled && (
            <DropdownItem>
              <Link to="/groups">Groups</Link>
            </DropdownItem>
          )}
          {config.users.enabled && (
            <DropdownItem>
              <Link to="/users">Users</Link>
            </DropdownItem>
          )}
          {config.serviceaccounts.enabled && (
            <DropdownItem>
              <Link to="/serviceaccounts">Service Accounts</Link>
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}
