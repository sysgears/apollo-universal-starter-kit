import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';

const required = value => (value ? undefined : 'Required');

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color}>
      <Input {...input} placeholder={label} type={type} />
      {touched && (error && <FormFeedback>{error}</FormFeedback>)}
    </FormGroup>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

const PostCommentForm = ({ handleSubmit, submitting, initialValues, onSubmit }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <Form name="comment" onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Row>
          <Col xs="2">
            <Label>{operation} comment</Label>
          </Col>
          <Col xs="8">
            <Field name="content" component={renderField} type="text" label="Content" validate={required} />
          </Col>
          <Col xs="2">
            <Button color="primary" type="submit" className="float-right" disabled={submitting}>
              Save
            </Button>
          </Col>
        </Row>
      </FormGroup>
    </Form>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'comment',
  enableReinitialize: true
})(PostCommentForm);
