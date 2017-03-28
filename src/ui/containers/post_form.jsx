import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, Label, Button } from 'reactstrap'

const PostForm = (props) => {
  const { handleSubmit, onSubmit } = props;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label htmlFor="title">Title</Label>
        <Field name="title" className="form-control" component="input" type="text"/>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="content">Contnent</Label>
        <Field name="content" className="form-control" component="input" type="text"/>
      </FormGroup>
      <Button color="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default reduxForm({
  form: 'post'
})(PostForm);