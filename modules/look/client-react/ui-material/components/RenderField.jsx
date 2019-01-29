import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

const RenderField = ({ input, label, type, meta: { touched, error }, placeholder, classes }) => {
  return (
    <TextField
      error={!!touched && !!error}
      fullWidth
      className={classes.textField}
      label={touched && error ? error : label}
      placeholder={placeholder || label}
      type={type}
      margin="normal"
      variant="outlined"
      {...input}
    />
  );
};

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RenderField);
