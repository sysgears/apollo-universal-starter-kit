import React, { Fragment } from 'react';
import ReactToPrint from 'react-to-print';
import { Button } from '@module/look-client-react';

export default Component => {
  return class UsersWithSubscription extends React.Component {
    render() {
      return (
        <Fragment>
          <Component {...this.props} ref={el => (this.componentRef = el)}>
            {' '}
          </Component>
          <ReactToPrint trigger={() => <Button>Print this out!</Button>} content={() => this.componentRef} />
        </Fragment>
      );
    }
  };
};
