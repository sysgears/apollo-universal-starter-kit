import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import filesize from 'filesize';
import { PageLayout, Button } from '../../common/components/web';
import settings from '../../../../../settings';

class UploadView extends React.PureComponent {
  renderMetaData = () => (
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

  onDrop = uploadFile => async ([file]) => {
    const result = await uploadFile(file);
    console.log(result);
  };

  renderFiles = () => {
    const { files, removeFile } = this.props;
    return files.map(file => (
      <div key={file.id}>
        <a href={file.path} download={file.name}>
          {file.name} ({filesize(file.size)})
        </a>
        <Button id="graphql-button" color="primary" onClick={() => removeFile(file.id)}>
          Remove
        </Button>
      </div>
    ));
  };

  render() {
    const { loading, files, uploadFile } = this.props;
    return (
      <PageLayout>
        {this.renderMetaData()}
        <div className="text-center">
          <Dropzone onDrop={this.onDrop(uploadFile)}>
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
          {!loading && files && this.renderFiles()}
        </div>
      </PageLayout>
    );
  }
}

UploadView.propTypes = {
  loading: PropTypes.bool.isRequired,
  files: PropTypes.array,
  uploadFile: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired
};

export default UploadView;
