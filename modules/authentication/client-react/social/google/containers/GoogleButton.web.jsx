import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { faGooglePlusSquare } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@gqlapp/look-client-react';
import './GoogleButton.css';

const googleLogin = () => {
  window.location = '/auth/google';
};

const GoogleButton = withApollo(({ text }) => {
  return (
    <Button type="button" size="lg" onClick={googleLogin} className="googleBtn">
      <div className="iconContainer">
        <FontAwesomeIcon icon={faGooglePlusSquare} className="googleIcon" />
        <div className="separator" />
      </div>
      <div className="btnText">
        <span>{text}</span>
      </div>
    </Button>
  );
});

const GoogleLink = withApollo(({ text }) => {
  return (
    <Button color="link" onClick={googleLogin} style={{ marginTop: 10 }}>
      {text}
    </Button>
  );
});

const GoogleIcon = () => (
  <FontAwesomeIcon
    icon={faGooglePlusSquare}
    style={{ marginTop: 10, color: '#c43832', fontSize: 40 }}
    onClick={googleLogin}
  />
);

const GoogleComponent = ({ type, text }) => {
  switch (type) {
    case 'button':
      return <GoogleButton text={text} />;
    case 'link':
      return <GoogleLink text={text} />;
    case 'icon':
      return <GoogleIcon />;
    default:
      return <GoogleButton text={text} />;
  }
};

GoogleComponent.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default GoogleComponent;
