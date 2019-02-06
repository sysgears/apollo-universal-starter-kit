import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MenuItem, Menu, Typography } from '@material-ui/core';

const styles = {
  paddingNone: {
    padding: '0'
  },
  title: {
    paddingTop: 2,
    cursor: 'pointer'
  }
};

class LanguagePicker extends React.Component {
  state = {
    anchorEl: null,
    selected: this.props.i18n.language.slice(0, 2).toUpperCase(),
    options: Object.keys(this.props.i18n.store.data)
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = lang => {
    this.props.i18n.changeLanguage(lang);
    this.setState({ selected: lang.slice(0, 2).toUpperCase(), anchorEl: null });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, i18n } = this.props;
    const { anchorEl, options, selected } = this.state;
    const languages = Object.keys(i18n.store.data);

    if (i18n.language && languages.length <= 1) return null;

    return (
      <React.Fragment>
        <Typography component="span" className={classes.title} onClick={this.handleClickListItem}>
          {selected}
        </Typography>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          className={classes.paddingNone}
        >
          {options.map(option => (
            <MenuItem
              key={option}
              selected={option.slice(0, 2).toUpperCase() === selected}
              onClick={() => this.handleMenuItemClick(option)}
            >
              {option.slice(0, 2).toUpperCase()}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

LanguagePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default withStyles(styles)(LanguagePicker);
