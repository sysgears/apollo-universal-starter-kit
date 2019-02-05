import React from 'react';
import PropTypes from 'prop-types';

// For Material UI style render
import { SheetsRegistry } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';

// Create a sheetsRegistry instance for Material UI.
export const sheetsRegistry = new SheetsRegistry();

// Create a sheetsManager instance for Material UI.
const sheetsManager = new Map();

// Create a theme instance for Material UI.
const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

// Create a new class name generator for Material UI.
const generateClassName = createGenerateClassName();

const muiProvider = ({ children }) => {
  return (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        {children}
      </MuiThemeProvider>
    </JssProvider>
  );
};

muiProvider.propTypes = {
  children: PropTypes.node
};

export default muiProvider;
