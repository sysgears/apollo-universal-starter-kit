import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

const ModalComponent = ({ children, ...props }) => <Modal {...props}>{children}</Modal>;

ModalComponent.propTypes = {
  children: PropTypes.node
};

export default ModalComponent;
