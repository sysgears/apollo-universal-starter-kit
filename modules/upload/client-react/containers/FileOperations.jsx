import React from 'react';
import PropTypes from 'prop-types';
import UploadView from '../components/UploadView';

export default class FileOperations extends React.Component {
  static propTypes = {
    uploadFiles: PropTypes.func,
    removeFile: PropTypes.func
  };

  state = {
    error: null
  };

  handleUploadFiles = async files => {
    const { uploadFiles } = this.props;
    const result = await uploadFiles(files);
    this.setState({ error: (result && result.error) || null });
  };

  handleRemoveFile = async id => {
    const { removeFile } = this.props;
    const result = await removeFile(id);
    this.setState({ error: (result && result.error) || null });
  };

  render() {
    return (
      <UploadView
        {...this.props}
        handleRemoveFile={this.handleRemoveFile}
        handleUploadFiles={this.handleUploadFiles}
        error={this.state.error}
      />
    );
  }
}
