import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class Popconfirm extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    size: PropTypes.string,
    color: PropTypes.string,
    placement: PropTypes.string,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { className = '', placement = 'left-start', color = null, size = 'sm', target, title, children } = this.props;
    const buttonsStyle = {
      marginLeft: '3px',
      marginRight: '3px'
    };
    return (
      <React.Fragment>
        <div onClick={this.toggle} id={target} className={className}>
          {children}
        </div>
        <Popover isOpen={this.state.isOpen} target={target} toggle={this.toggle} placement={placement}>
          <PopoverHeader>{title}</PopoverHeader>
          <PopoverBody>
            <Button color={color ? color : 'secondary'} size={size} onClick={this.toggle} style={buttonsStyle}>
              Cancel
            </Button>
            <Button color={color ? color : 'primary'} size={size} onClick={this.props.onConfirm} style={buttonsStyle}>
              Ok
            </Button>
          </PopoverBody>
        </Popover>
      </React.Fragment>
    );
  }
}

export default Popconfirm;
