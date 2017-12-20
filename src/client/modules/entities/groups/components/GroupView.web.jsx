import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { Container, Row, Col, PageLayout, Button } from '../../../common/components/web';

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
    let localTitle = loading ? title : group.profile.displayName;
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
                    <Button color="primary">Back</Button>
                  </Link>
                </Col>
                <Col xs={8}>
                  <h2>Group - {group.profile.displayName}</h2>
                </Col>
                <Col xs={2}>
                  <Link to={'/groups/' + group.id + '/edit'}>
                    <Button color="primary">Add</Button>
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
                  <h4>Id:</h4>
                </Col>
                <Col xs={8}>{group.id}</Col>
                <Col xs={2} />
              </Row>

              <Row>
                <Col xs={2}>
                  <h4>Name:</h4>
                </Col>
                <Col xs={8}>{group.name}</Col>
                <Col xs={2} />
              </Row>
            </Container>
          </div>
          <div>
            <Container>
              <hr />

              <Row>
                <Col xs={2}>
                  <h4>Users:</h4>
                </Col>
                <Col xs={10}>
                  {group.users &&
                    group.users.map(u => (
                      <div>
                        <Link to={'/users/' + u.id}>{u.profile.displayName}</Link> -{' '}
                        <a href={'mailto:' + u.email}>{u.email}</a>
                      </div>
                    ))}
                </Col>
                <Col xs={2} />
              </Row>
            </Container>
          </div>
        </PageLayout>
      );
    }
  }
}
