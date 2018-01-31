import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from './FieldAdaptor';
import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';

const PostCommentForm = ({ values, handleSubmit, submitting, initialValues }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <Form name="comment" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>{operation} comment</Label>
        </Col>
        <Col xs={8}>
          <Field name="content" component={RenderField} type="text" />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right" disabled={submitting} value={values.content}>
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.string
};

const EnhancedForm = withFormik({
  mapPropsToValues: props => ({ comment: props.comment }),
  validationSchema: Yup.object().shape({
    comment: Yup.string().required('Email is required!')
  }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm();
  },
  displayName: 'CommentForm ' // helps with React DevTools
});

export default EnhancedForm(PostCommentForm);
