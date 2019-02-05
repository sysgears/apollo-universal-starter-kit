import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import firebase from 'firebase/app';
import 'firebase/auth';
import faFacebookSquare from '@fortawesome/fontawesome-free-brands/faFacebookSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '@gqlapp/look-client-react';

import settings from '../../../../../../settings';

import './FacebookButton.css';

const facebookLogin = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope(settings.firebase.facebook.scope);
  try {
    firebase.auth().signInWithRedirect(provider);
  } catch (e) {
    console.log(e);
  }
};

const FacebookButton = withApollo(({ text }) => {
  return (
    <Button type="button" size="lg" onClick={facebookLogin} className="facebookBtn">
      <div className="iconContainer">
        <FontAwesomeIcon icon={faFacebookSquare} className="facebookIcon" />
        <div className="separator" />
      </div>
      <div className="btnText">
        <span>{text}</span>
      </div>
    </Button>
  );
});

const FacebookLink = withApollo(({ text }) => {
  return (
    <Button color="link" onClick={facebookLogin} style={{ marginTop: 10 }}>
      {text}
    </Button>
  );
});

const FacebookIcon = () => (
  <FontAwesomeIcon
    icon={faFacebookSquare}
    style={{ marginTop: 10, color: '#17427e', fontSize: 40 }}
    onClick={facebookLogin}
  />
);

const FacebookComponent = ({ text, type }) => {
  switch (type) {
    case 'button':
      return <FacebookButton text={text} />;
    case 'link':
      return <FacebookLink text={text} />;
    case 'icon':
      return <FacebookIcon />;
    default:
      return <FacebookButton text={text} />;
  }
};

FacebookComponent.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default FacebookComponent;
