import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import filesize from 'filesize';

import { PageLayout, Row, Col, Table, Button, Alert } from '../../common/components/web';
import settings from '../../../../../../settings';

const UploadView = ({ files, t, handleRemoveFile, handleUploadFiles, error }) => {
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
  uploadFiles: PropTypes.func.isRequired,
  error: PropTypes.string,
  handleRemoveFile: PropTypes.func.isRequired,
  handleUploadFiles: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default UploadView;
