import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout, Container, Row, Col, Button } from '../../../common/components/web';

import GroupMembers from '../containers/GroupMembers';

import settings from '../../../../../../settings';

const title = `${settings.app.name} - Group Page`;
const description = 'Group Page with some details';

export default class GroupView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    group: PropTypes.object,
    editGroup: PropTypes.func.isRequired
  };

  renderMetaData() {
    const { loading, group } = this.props;
    let localTitle = loading ? title : group.name;
    let localDescription = loading ? description : group.profile.description;

    return (
      <Helmet
        title={localTitle}
        meta={[
          {
            name: 'description',
            content: localDescription
          }
        ]}
      />
    );
  }

  render() {
    const { loading, group } = this.props;
    if (loading && !group) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center mt-4 mb-4">
            <Container>
              <Row>
                <Col xs={2}>
                  <Link to={'/groups'}>
                    <Button color="primary">Back</Button>
                  </Link>
                </Col>
                <Col xs={8}>
                  <h2>{title}</h2>
                </Col>
                <Col xs={2} />
              </Row>

              <hr />

              <Row>
                <Col xs={2} />
                <Col xs={8}>
                  <p>Loading...</p>
                </Col>
                <Col xs={2} />
              </Row>
            </Container>
          </div>
        </PageLayout>
      );
    } else {
      console.log('Group', group);
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center mt-4 mb-4">
            <Container>
              <Row>
                <Col xs={2}>
                  <Link to={'/groups'}>
                    <Button color="primary">All Groups</Button>
                  </Link>
                </Col>
                <Col xs={8}>
                  <h2>Group - {group.name}</h2>
                </Col>
                <Col xs={2}>
                  <Link to={'/groups/' + group.id + '/edit'}>
                    <Button color="primary">Edit</Button>
                  </Link>
                </Col>
              </Row>
            </Container>
          </div>
          <div>
            <Container>
              <hr />

              <Row>
                <Col xs={2}>
                  <h4>Info:</h4>
                </Col>
                <Col xs={10}>
                  <Row>
                    <Col xs={3}>
                      <b>ID:</b>
                    </Col>
                    <Col xs={9}>{group.id}</Col>
                    <Col xs={3}>
                      <b>Name:</b>
                    </Col>
                    <Col xs={9}> {group.name}</Col>
                    <Col xs={3}>
                      <b>Display Name:</b>{' '}
                    </Col>
                    <Col xs={9}>{group.profile.displayName}</Col>
                    <Col xs={3}>
                      <b>Description:</b>{' '}
                    </Col>
                    <Col xs={9}>{group.profile.description}</Col>
                    <Col xs={3}>
                      <b>Roles:</b>{' '}
                    </Col>
                    <Col xs={9}>
                      {group.roles &&
                        group.roles.map(r => {
                          return (
                            <span>
                              {' '}
                              <Link to={'/roles/' + r.id}>{r.name}</Link>{' '}
                            </span>
                          );
                        })}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <hr />

              <Row>
                <Col xs={2}>
                  <h4>Members:</h4>
                </Col>
                <Col xs={10}>
                  <GroupMembers id={group.id} roles={group.roles} groupMembers={group.users} />
                </Col>
              </Row>
            </Container>
          </div>
        </PageLayout>
      );
    }
  }
}
