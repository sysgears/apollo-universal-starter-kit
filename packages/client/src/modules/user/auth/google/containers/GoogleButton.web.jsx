import React from 'react';
import faGooglePlusSquare from '@fortawesome/fontawesome-free-brands/faGooglePlusSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '../../../../common/components/web';

const googleLogin = () => {
  window.location = __API_URL__ + '/auth/google';
};

const GoogleButton = () => {
  return (
    <Button color="primary" type="button" onClick={googleLogin} style={{ marginTop: 10 }}>
      Login with Google
    </Button>
  );
};

const GoogleLink = () => {
  return (
    <Button color="link" onClick={googleLogin} style={{ marginTop: 10 }}>
      Login with Google
    </Button>
  );
};

const GoogleIcon = () => {
  return <FontAwesomeIcon icon={faGooglePlusSquare} size="2x" style={{ marginTop: 10 }} onClick={googleLogin} />;
};

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
