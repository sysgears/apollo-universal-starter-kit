import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import filesize from 'filesize';

import { PageLayout, Row, Col, Table, Button, Alert } from '@module/look-client-react';
import settings from '../../../../settings';

const UploadView = ({ files, error, loading, handleUploadFiles, handleRemoveFile, t }) => {
  const renderMetaData = () => {
    return (
      <Helmet
        title={`${settings.app.name} - ${t('title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('meta')}`
          }
        ]}
      />
    );
  };

  const columns = [
    {
      title: t('table.column.name'),
      dataIndex: 'name',
      key: 'name',
      render(text, record) {
        return (
          <a href={record.path} download={text}>
            {text} ({filesize(record.size)})
          </a>
        );
      }
    },
    {
      title: t('table.column.actions'),
      key: 'actions',
      width: 50,
      render(text, record) {
        return (
          <Button color="primary" size="sm" className="delete-button" onClick={() => handleRemoveFile(record.id)}>
            {t('table.btnDel')}
          </Button>
        );
      }
    }
  ];

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center">
        <Row>
          <Col xs={4}>
            <Dropzone onDrop={handleUploadFiles}>
              <p>{t('message')}</p>
            </Dropzone>
          </Col>
          <Col xs={8}>
            {loading && <span>Loading...</span>}
            {error && <Alert color="error">{error}</Alert>}
            {files && <Table dataSource={files} columns={columns} />}
          </Col>
        </Row>
      </div>
    </PageLayout>
  );
};

UploadView.propTypes = {
  files: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  handleUploadFiles: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default UploadView;
