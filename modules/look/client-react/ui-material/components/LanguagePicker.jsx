import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  paddingNone: {
    padding: '0'
  }
});

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
    const { classes } = this.props;
    const { anchorEl, options, selected } = this.state;

    return (
      <div className={classes.root}>
        <List className={classes.paddingNone}>
          <ListItem button onClick={this.handleClickListItem} className={classes.paddingNone}>
            <ListItemText secondary={selected} />
          </ListItem>
        </List>
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
      </div>
    );
  }
}

LanguagePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default withStyles(styles)(LanguagePicker);
