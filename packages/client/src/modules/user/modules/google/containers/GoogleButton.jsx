import React from 'react';
import url from 'url';
import { Button } from '../../../../common/components/web/index';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

const googleLogin = () => {
  window.location = `${protocol}//${hostname}:${serverPort}/auth/google`;
};

const GoogleButton = () => {
  return (
    <Button color="primary" type="button" onClick={googleLogin} style={{ margin: 10 }}>
      Login with Google
    </Button>
  );
};

const GoogleLink = () => {
  return (
    <Button color="link" onClick={googleLogin} style={{ margin: 10 }}>
      Login with Google
    </Button>
  );
};

const GoogleIcon = () => {
  return (
    <img
      src="https://www.outsystems.com/forgeCore/_image.aspx/A28atdGCIn2i_ZW11S_0KWgJm3iqRyDV-m8=/google-login-plugin"
      style={{ margin: 10, height: 38 }}
      onClick={googleLogin}
    />
  );
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
