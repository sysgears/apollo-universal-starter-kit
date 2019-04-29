import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { translate } from '@gqlapp/i18n-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { required, validate } from '@gqlapp/validation-common-react';
import { FormView, RenderField, Button, primary, lookStyles } from '@gqlapp/look-client-react-native';

const commentFormSchema = {
  content: [required]
};

const PostCommentForm = ({ values, handleSubmit, comment, t }) => {
  const operation = t(`comment.label.${comment.id ? 'edit' : 'add'}`);

  return (
    <FormView style={{ paddingHorizontal: 15 }}>
      <Field
        name="content"
        component={RenderField}
        type="text"
        value={values.content}
        placeholder={t('comment.label.field')}
        placeholderTextColor={lookStyles.placeholderColor}
      />
      <View style={lookStyles.submit}>
        <Button type={primary} onPress={handleSubmit}>
          {operation}
        </Button>
      </View>
    </FormView>
  );
};

PostCommentForm.propTypes = {
  handleSubmit: PropTypes.func,
  comment: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  t: PropTypes.func
};

const PostCommentFormWithFormik = withFormik({
  mapPropsToValues: props => ({ content: props.comment && props.comment.content }),
  validate: values => validate(values, commentFormSchema),
  handleSubmit: async (values, { resetForm, props: { onSubmit } }) => {
    await onSubmit(values);
    resetForm();
  },
  displayName: 'CommentForm', // helps with React DevTools
  enableReinitialize: true
});

export default translate('post')(PostCommentFormWithFormik(PostCommentForm));
