import React from 'react';
import PropTypes from 'prop-types';

import { Container, Col, Row } from '../../../web';

const ObjectView = ({ object, fields }) => {
  return (
    <Container>
      {fields.map(field => {
        return (
          <Row key={field}>
            <Col xs={5} md={3}>
              <b>{field}</b>
            </Col>
            <Col xs={7} md={9}>
              {object[field]}
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

ObjectView.propTypes = {
  object: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired
};

export default ObjectView;
