import React from 'react';
import url from 'url';
import { Button } from '../../../../common/components/web/index';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

const facebookLogin = () => {
  window.location = `${protocol}//${hostname}:${serverPort}/auth/facebook`;
};

const FacebookButton = () => {
  return (
    <Button color="primary" type="button" onClick={facebookLogin} style={{ margin: 10 }}>
      Login with Facebook
    </Button>
  );
};

const FacebookLink = () => {
  return (
    <Button color="link" onClick={facebookLogin} style={{ margin: 10 }}>
      Login with Facebook
    </Button>
  );
};

const FacebookIcon = () => {
  return (
    <img
      src="http://www.pvhc.net/img48/fsbsrwlwxxczsesauqbb.png"
      style={{ margin: 10, height: 38 }}
      onClick={facebookLogin}
    />
  );
};

const FacebookComponent = props => {
  switch (props.type) {
    case 'button':
      return <FacebookButton />;
    case 'link':
      return <FacebookLink />;
    case 'icon':
      return <FacebookIcon />;
    default:
      return <FacebookButton />;
  }
};

export default FacebookComponent;
