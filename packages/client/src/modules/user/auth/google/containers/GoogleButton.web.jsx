import React from 'react';
import { withApollo } from 'react-apollo';
import faGooglePlusSquare from '@fortawesome/fontawesome-free-brands/faGooglePlusSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '../../../../common/components/web';
import access from '../../../access';

const googleLogin = () => {
  window.location = '/auth/google';
};

const GoogleButton = withApollo(({ client }) => {
  return (
    <Button
      color="primary"
      type="button"
      onClick={() => access.doLogin(client).then(googleLogin)}
      style={{ marginTop: 10 }}
    >
      Login with Google
    </Button>
  );
});

const GoogleLink = withApollo(({ client }) => {
  return (
    <Button color="link" onClick={() => access.doLogin(client).then(googleLogin)} style={{ marginTop: 10 }}>
      Login with Google
    </Button>
  );
});

const GoogleIcon = withApollo(({ client }) => {
  return (
    <FontAwesomeIcon
      icon={faGooglePlusSquare}
      size="2x"
      style={{ marginTop: 10 }}
      onClick={() => access.doLogin(client).then(googleLogin)}
    />
  );
});

const GoogleComponent = props => {
  switch (props.type) {
    case 'button':
      return <GoogleButton />;
    case 'link':
      return <GoogleLink />;
    case 'icon':
      return <GoogleIcon />;
    default:
      return <GoogleButton />;
  }
};

export default GoogleComponent;
