import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Yup from 'yup';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Content is required!')
});

const PostCommentForm = ({ values, handleSubmit, initialValues, handleChange }) => {
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
          <Field name="content" component={RenderField} type="text" value={values.content} onChange={handleChange} />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right">
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
  values: PropTypes.object,
  content: PropTypes.string,
  changeContent: PropTypes.func
};

const PostCommentFormWithFormik = withFormik({
  mapPropsToValues: props => ({ content: (props.comment && props.comment.content) || '' }),
  validationSchema: validationSchema,
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm({ content: '' });
  },
  displayName: 'CommentForm', // helps with React DevTools,
  enableReinitialize: true
});

export default PostCommentFormWithFormik(PostCommentForm);
