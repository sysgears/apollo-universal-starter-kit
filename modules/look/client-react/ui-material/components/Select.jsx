import React from 'react';
import PropTypes from 'prop-types';
import { Select as MUISelect } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  select: {
    minWidth: '120px'
  }
};

class Select extends React.Component {
  state = {
    value: this.props.defaultValue
  };

  handleChange = event => {
    this.setState(() => ({ value: event.target.value }));
    this.props.onChange(event);
  };

  render() {
    const { classes, children } = this.props;
    return (
      <MUISelect className={classes.select} value={this.state.value} onChange={this.handleChange}>
        {children}
      </MUISelect>
    );
  }
}

Select.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  onChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withStyles(styles)(Select);
