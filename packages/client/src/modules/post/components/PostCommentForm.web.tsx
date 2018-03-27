import React from 'react';
import { withFormik, FormikProps } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';
import { Comment, CommentFormProps } from '../types';

const commentFormSchema: any = {
  content: [required]
};

const validate = (values: Comment) => validateForm(values, commentFormSchema);

const PostCommentForm = ({ values, handleSubmit, comment }: CommentFormProps & FormikProps<Comment>) => {
  return (
    <Form name="comment" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>{comment.id === null ? 'Add comment' : 'Edit comment'}</Label>
        </Col>
        <Col xs={8}>
          <Field name="content" component={RenderField} type="text" value={values.content} placeholder="Comment" />
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

const PostCommentFormWithFormik = withFormik<CommentFormProps, Comment>({
  mapPropsToValues: ({ comment }) => ({ content: comment && comment.content }),
  async handleSubmit(values: Comment, { resetForm, props: { onSubmit } }: any) {
    await onSubmit(values);
    resetForm({ content: '' });
  },
  validate: (values: Comment) => validate(values),
  displayName: 'CommentForm', // helps with React DevTools,
  enableReinitialize: true
});

export default PostCommentFormWithFormik(PostCommentForm);
