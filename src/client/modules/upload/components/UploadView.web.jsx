import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import filesize from 'filesize';
import { PageLayout, Row, Col, Table, Button } from '../../common/components/web';
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

  onDrop = uploadFiles => async files => {
    const result = await uploadFiles(files);
    console.log(result);
  };

  hendleRemoveFile = id => {
    const { removeFile } = this.props;
    removeFile(id);
  };

  render() {
    const { loading, files, uploadFiles } = this.props;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <a href={record.path} download={text}>
            {text} ({filesize(record.size)})
          </a>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 50,
        render: (text, record) => (
          <Button color="primary" size="sm" className="delete-button" onClick={() => this.hendleRemoveFile(record.id)}>
            Delete
          </Button>
        )
      }
    ];

    return (
      <PageLayout>
        {this.renderMetaData()}
        <div className="text-center">
          <Row>
            <Col xs={4}>
              <Dropzone onDrop={this.onDrop(uploadFiles)}>
                <p>Try dropping some files here, or click to select files to upload.</p>
              </Dropzone>
            </Col>
            <Col xs={8}>{!loading && files && <Table dataSource={files} columns={columns} />}</Col>
          </Row>
        </div>
      </PageLayout>
    );
  }
}

UploadView.propTypes = {
  loading: PropTypes.bool.isRequired,
  files: PropTypes.array,
  uploadFiles: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired
};

export default UploadView;
