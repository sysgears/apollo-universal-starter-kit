import React from 'react';
import PropTypes from 'prop-types';
import { SnackbarContent, Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

const variantIcon = {
  danger: WarningIcon,
  error: ErrorIcon
};

const styles = theme => ({
  wrapperField: {
    padding: '0 10px',
    margin: '20px 0'
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  danger: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});

const Alert = ({ children, classes, color: variant, ...props }) => {
  const Icon = variantIcon[variant];

  return (
    <Grid item className={classes.wrapperField}>
      <SnackbarContent
        className={classes[variant]}
        message={
          <span className={classes.message}>
            <Icon className={classes.icon} />
            {children}
          </span>
        }
        {...props}
      />
    </Grid>
  );
};

Alert.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  classes: PropTypes.object
};

export default withStyles(styles)(Alert);
