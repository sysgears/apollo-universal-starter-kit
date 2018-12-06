import React from 'react';
import PropTypes from 'prop-types';
import RNModal from 'react-native-modal';

const Modal = ({ children, ...props }) => <RNModal {...props}>{children}</RNModal>;

Modal.propTypes = {
  children: PropTypes.node
};

export default Modal;
