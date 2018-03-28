import React from 'react';
import { compose } from 'react-apollo';

import UploadView from '../components/UploadView.web';
import { withFiles, withFilesUploading, withFilesRemoving } from '../graphql';

import { UploadProps } from '../types';

class Upload extends React.Component<UploadProps, any> {
  public render() {
    return <UploadView {...this.props} />;
  }
}

export default compose(withFiles, withFilesUploading, withFilesRemoving)(Upload);
