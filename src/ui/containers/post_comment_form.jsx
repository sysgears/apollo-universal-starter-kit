import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Row, Col, Form, FormGroup, Label, Button } from 'reactstrap'

const CommentForm = (props) => {
  const { handleSubmit, onSubmit, initialValues } = props;

  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Row>
          <Col xs="2"><Label>{operation} comment</Label></Col>
          <Col xs="8"><Field name="content" className="form-control" component="input" type="text"/></Col>
          <Col xs="2">
            <Button color="primary" type="submit" className="float-right">
              Submit
            </Button>
          </Col>
        </Row>
      </FormGroup>
    </Form>
  );
};

export default reduxForm({
  form: 'comment',
  enableReinitialize: true
})(CommentForm);