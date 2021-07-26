import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { translate } from '@gqlapp/i18n-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { required, validate } from '@gqlapp/validation-common-react';
import { Form, RenderField } from '@gqlapp/look-client-react';
import { Image, Button } from 'semantic-ui-react';

const postFormSchema = {
  title: [required],
  content: [required]
  //pic,
};

const PostForm = ({ values, handleSubmit, submitting, t, post }) => {
  const inputFile = useRef(null);
  const [files, setFiles] = useState(post && post.pic);

  const onChangeFile = event => {
    event.stopPropagation();
    event.preventDefault();

    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        setFiles(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const openFile = evt => {
    evt.preventDefault();
    evt.stopPropagation();

    inputFile.current.click();
  };

  useEffect(() => {
    values.pic = files;
  }, [files, values.pic]);

  return (
    <Form name="post" onSubmit={handleSubmit}>
      <Field name="title" component={RenderField} type="text" label={t('post.field.title')} value={values.title} />
      <Field
        name="content"
        component={RenderField}
        type="text"
        label={t('post.field.content')}
        value={values.content}
      />
      {files && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ marginBottom: '10px' }}>Preview</div>
          <Image src={files} size="small" />
        </div>
      )}
      <input
        type="file"
        accept="image/x-png,image/png,image/jpeg"
        id="file"
        ref={inputFile}
        onChange={onChangeFile}
        style={{ display: 'none' }}
      />
      <Button onClick={openFile}>Uplaoad Picture</Button>
      <Button color="primary" type="submit" disabled={submitting}>
        {t('post.btn.submit')}
      </Button>
    </Form>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  post: PropTypes.object,
  t: PropTypes.func
};

const PostFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    title: props.post && props.post.title,
    content: props.post && props.post.content
  }),
  validate: values => validate(values, postFormSchema),
  async handleSubmit(
    values,
    {
      props: { onSubmit }
    }
  ) {
    const uploadAndGetUrl = async file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'fya2dprk');
      formData.append('folder', `test`);
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/personalhrit/image/upload`, {
          method: 'post',
          body: formData
        });
        const data = await response.json();
        return data.secure_url;
      } catch (e) {}
    };

    const picUrl = await uploadAndGetUrl(values.pic);
    values.pic = picUrl;

    onSubmit(values);
  },
  enableReinitialize: true,
  displayName: 'PostForm' // helps with React DevTools
});

export default translate('post')(PostFormWithFormik(PostForm));
