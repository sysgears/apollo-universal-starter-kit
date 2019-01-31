import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const styles = {
  wrapperField: {
    padding: '0 10px'
  }
};

const RenderField = ({ input, label, type, meta: { touched, error }, placeholder, classes }) => (
  <Grid item className={classes.wrapperField}>
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
  </Grid>
);

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RenderField);
