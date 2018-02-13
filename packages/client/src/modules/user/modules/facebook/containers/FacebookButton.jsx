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

export default FacebookButton;
