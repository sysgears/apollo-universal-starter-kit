import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  }
});

const FormItem = ({ children, label, classes, ...props }) => {
  return (
    <FormControl {...props} className={classes.formControl}>
      {label && (
        <InputLabel>
          {label}
          :&nbsp;
        </InputLabel>
      )}
      {children}
    </FormControl>
  );
};

FormItem.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormItem);
