import React from 'react';
import { compose } from 'react-apollo';

import UploadView from '../components/UploadView.native';
import { withFiles, withFilesUploading, withFilesRemoving } from '../graphql';

class Upload extends React.Component {
  public render() {
    return <UploadView />;
  }
}

export default compose(withFiles, withFilesUploading, withFilesRemoving)(Upload);
