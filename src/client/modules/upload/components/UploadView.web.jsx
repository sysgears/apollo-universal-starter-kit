import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import { PageLayout } from '../../common/components/web';

const onDrop = uploadFile => async ([file]) => {
  const result = await uploadFile(file);
  console.log(result);
};

const UploadView = ({ uploadFile }) => {
  const renderMetaData = () => (
    <Helmet
      title="Upload"
      meta={[
        {
          name: 'description',
          content: 'Upload page'
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <Dropzone onDrop={onDrop(uploadFile)}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
      </div>
    </PageLayout>
  );
};

UploadView.propTypes = {
  uploadFile: PropTypes.func.isRequired
};

export default UploadView;
