import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const commentFormSchema = {
  content: [required]
};

const validate = values => validateForm(values, commentFormSchema);

const PostCommentForm = ({ values, handleSubmit, comment, t }) => {
  return (
    <Form name="comment" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>
            {t(`comment.label.${comment.id ? 'edit' : 'add'}`)} {t('comment.label.comment')}
          </Label>
        </Col>
        <Col xs={8}>
          <Field
            name="content"
            component={RenderField}
            type="text"
            value={values.content}
            placeholder={t('comment.label.field')}
          />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right">
            {t('comment.btn.submit')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  comment: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  content: PropTypes.string,
  changeContent: PropTypes.func,
  t: PropTypes.func
};

const PostCommentFormWithFormik = withFormik({
  mapPropsToValues: props => ({ content: props.comment && props.comment.content }),
  async handleSubmit(
    values,
    {
      resetForm,
      props: { onSubmit }
    }
  ) {
    await onSubmit(values);
    resetForm({ content: '' });
  },
  validate: values => validate(values),
  displayName: 'CommentForm', // helps with React DevTools,
  enableReinitialize: true
});

export default translate('post')(PostCommentFormWithFormik(PostCommentForm));
