import React from 'react';
import { withApollo } from 'react-apollo';
import faFacebookSquare from '@fortawesome/fontawesome-free-brands/faFacebookSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '../../../../common/components/web';
import access from '../../../access';

const facebookLogin = () => {
  window.location = '/auth/facebook';
};

const FacebookButton = withApollo(({ client }) => {
  return (
    <Button
      color="primary"
      type="button"
      onClick={() => access.doLogin(client).then(facebookLogin)}
      style={{ marginTop: 10 }}
    >
      Login with Facebook
    </Button>
  );
});

const FacebookLink = withApollo(({ client }) => {
  return (
    <Button color="link" onClick={() => access.doLogin(client).then(facebookLogin)} style={{ marginTop: 10 }}>
      Login with Facebook
    </Button>
  );
});

const FacebookIcon = withApollo(({ client }) => {
  return (
    <FontAwesomeIcon
      icon={faFacebookSquare}
      size="2x"
      style={{ marginTop: 10 }}
      onClick={() => access.doLogin(client).then(facebookLogin)}
    />
  );
});

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
