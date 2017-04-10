import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';

const required = value => value ? undefined : 'Required';

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color}>
      <Input {...input} placeholder={label} type={type}/>
      {touched && ((error && <FormFeedback>{error}</FormFeedback>))}
    </FormGroup>
  );
};

renderField.propTypes = {
  input: React.PropTypes.object,
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  meta: React.PropTypes.object
};

const CommentForm = (props) => {
  const { handleSubmit, submitting, initialValues, onSubmit } = props;

  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Row>
          <Col xs="2"><Label>{operation} comment</Label></Col>
          <Col xs="8"><Field name="content" component={renderField} type="text" label="Contnent"  validate={required}/></Col>
          <Col xs="2">
            <Button color="primary" type="submit" className="float-right"  disabled={submitting}>
              Submit
            </Button>
          </Col>
        </Row>
      </FormGroup>
    </Form>
  );
};

CommentForm.propTypes = {
  handleSubmit: React.PropTypes.func,
  initialValues: React.PropTypes.object,
  onSubmit: React.PropTypes.func,
  submitting: React.PropTypes.bool
};

export default reduxForm({
  form: 'comment',
  enableReinitialize: true
})(CommentForm);