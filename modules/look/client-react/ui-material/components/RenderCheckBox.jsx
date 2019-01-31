import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Checkbox, FormControl, FormHelperText, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  wrapperField: {
    padding: '0 10px'
  }
};

const RenderCheckBox = ({ classes, input, label, meta: { touched, error } }) => (
  <Grid item className={classes.wrapperField}>
    <FormControl>
      <FormControlLabel control={<Checkbox {...input} color="primary" />} label={label} />
      {touched && (error && <FormHelperText>{error}</FormHelperText>)}
    </FormControl>
  </Grid>
);

RenderCheckBox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  classes: PropTypes.object,
  meta: PropTypes.object
};

export default withStyles(styles)(RenderCheckBox);
