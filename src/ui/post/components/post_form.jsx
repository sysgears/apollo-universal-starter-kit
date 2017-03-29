import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap'

const required = value => value ? undefined : 'Required';

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  let color = 'normal';
  if (touched && error) {
    color = 'danger';
  }

  return (
    <FormGroup color={color}>
      <Label>{label}</Label>
      <div>
        <Input {...input} placeholder={label} type={type}/>
        {touched && ((error && <FormFeedback>{error}</FormFeedback>))}
      </div>
    </FormGroup>
  )
};

const PostForm = (props) => {
  const { handleSubmit, submitting, onSubmit } = props;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field name="title" component={renderField} type="text" label="Title" validate={required}/>
      <Field name="content" component={renderField} type="text" label="Contnent" validate={required}/>
      <Button color="primary" type="submit" disabled={submitting}>
        Submit
      </Button>
    </Form>
  );
};

PostForm.propTypes = {
  handleSubmit: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
};

export default reduxForm({
  form: 'post'
})(PostForm);