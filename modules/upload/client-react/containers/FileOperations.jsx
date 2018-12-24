import React from 'react';
import UploadView from '../components/UploadView';

export default class FileOperations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleUploadFiles = async files => {
    const { uploadFiles } = this.props;
    const result = await uploadFiles(files);

    this.setState({ error: result && result.error ? result.error : null });
  };

  handleRemoveFile = async id => {
    const { removeFile } = this.props;
    const result = await removeFile(id);

    this.setState({ error: result && result.error ? result.error : null });
  };

  render() {
    return (
      <UploadView {...this.props} handleRemoveFile={this.handleRemoveFile} handleUploadFiles={this.handleUploadFiles} />
    );
  }
}
