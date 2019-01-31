import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { OutlinedInput, InputLabel, FormHelperText, FormControl, Select, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  wrapperField: {
    padding: '15px 10px 10px'
  }
};

class RenderSelect extends React.Component {
  state = {
    value: this.props.value,
    labelWidth: 0
  };

  componentDidMount() {
    /*eslint-disable */
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
    /*eslint-enable */
  }

  handleChange = event => {
    this.setState(() => ({ value: event.target.value }));
    this.props.input.onChange(event);
  };

  render() {
    const {
      classes,
      input: { onChange, ...restInput },
      label,
      children,
      meta: { touched, error }
    } = this.props;

    return (
      <Grid item className={classes.wrapperField}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
          >
            {label}
          </InputLabel>
          <Select
            value={this.state.age}
            onChange={this.handleChange}
            {...restInput}
            input={<OutlinedInput labelWidth={this.state.labelWidth} />}
          >
            {children}
          </Select>
          {touched && (error && <FormHelperText>{error}</FormHelperText>)}
        </FormControl>
      </Grid>
    );
  }
}

RenderSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  children: PropTypes.node,
  classes: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withStyles(styles)(RenderSelect);
