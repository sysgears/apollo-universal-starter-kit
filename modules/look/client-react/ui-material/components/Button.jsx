import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';

class Button extends React.Component {
  render() {
    const { children, size, ...props } = this.props;
    return (
      <MUIButton variant="contained" color="primary" {...props}>
        {children}
      </MUIButton>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  size: PropTypes.string
};

Button.defaultProps = {
  size: ''
};

export default Button;
