/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardTitle, CardGroup, CardText } from '../../../common/components/web';

export default class GroupMembersView extends React.PureComponent {
  render() {
    let { group } = this.props;

    return (
      <div>
        <h3>{group.profile ? group.profile.displayName : group.name}</h3>
        <hr />

        <Card>
          <CardGroup>
            <CardText>
              <b>Id:</b> {group.id}
            </CardText>
            <CardText>
              <b>Created: </b> {group.createdAt}
            </CardText>
            <CardText>
              <b>Updated: </b> {group.updatedAt}
            </CardText>
          </CardGroup>

          <CardGroup>
            <CardText>
              <b>Name:</b> {group.name}
            </CardText>
            <CardText>
              <b>Display Name:</b> {group.profile.displayName}
            </CardText>
            <CardText>
              <b>Description:</b> {group.profile.description}
            </CardText>
          </CardGroup>
        </Card>
      </div>
    );
  }
}
