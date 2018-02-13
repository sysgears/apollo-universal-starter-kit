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

const FacebookButton = () => {
  return (
    <Button color="primary" type="button" onClick={googleLogin} style={{ margin: 10 }}>
      Login with Google
    </Button>
  );
};

export default FacebookButton;
