import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdaptor';
import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Comment is required!')
});

const PostCommentForm = ({ values, handleSubmit, submitting, initialValues, handleChange }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <Form name="post" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>{operation} comment</Label>
        </Col>
        <Col xs={8}>
          <Field name="content" component={RenderField} type="text" value={values.content} onChange={handleChange} />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right" disabled={submitting}>
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object
};

const PostCommentFormWithFormik = withFormik({
  mapPropsToValues: () => ({ content: '' }),
  validationSchema: validationSchema,
  handleSubmit(values, { resetForm, props: { onSubmit } }) {
    onSubmit(values);
    resetForm({ content: '' });
  },
  displayName: 'CommentForm ' // helps with React DevTools
});

export default PostCommentFormWithFormik(PostCommentForm);
