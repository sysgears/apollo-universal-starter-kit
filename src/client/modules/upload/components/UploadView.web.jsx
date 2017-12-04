import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import filesize from 'filesize';

import { PageLayout } from '../../common/components/web';
import settings from '../../../../../settings';

const onDrop = uploadFile => async ([file]) => {
  const result = await uploadFile(file);
  console.log(result);
};

const renderFiles = files => {
  return files.map(file => (
    <div key={file.id}>
      <a href={file.path} download={file.name} alt={file.name} target="blank">
        {file.name} ({filesize(file.size)})
      </a>
    </div>
  ));
};

const UploadView = ({ loading, files, uploadFile }) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Upload`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Upload page`
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center">
        <Dropzone onDrop={onDrop(uploadFile)}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
        {!loading && files && renderFiles(files)}
      </div>
    </PageLayout>
  );
};

UploadView.propTypes = {
  loading: PropTypes.bool.isRequired,
  files: PropTypes.array,
  uploadFile: PropTypes.func.isRequired
};

export default UploadView;
