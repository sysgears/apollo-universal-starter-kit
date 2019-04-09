import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import faLinkedInSquare from '@fortawesome/fontawesome-free-brands/faLinkedin';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '@gqlapp/look-client-react';
import './LinkedInButton.css';

const linkedInLogin = () => {
  window.location = '/auth/linkedin';
};

const LinkedInButton = withApollo(({ text }) => {
  return (
    <Button type="button" size="lg" onClick={linkedInLogin} className="linkedInBtn">
      <div className="iconContainer">
        <FontAwesomeIcon icon={faLinkedInSquare} className="linkedInIcon" />
        <div className="separator" />
      </div>
      <div className="btnText">
        <span>{text}</span>
      </div>
    </Button>
  );
});

const LinkedInLink = withApollo(({ text }) => {
  return (
    <Button color="link" onClick={linkedInLogin} style={{ marginTop: 10 }}>
      {text}
    </Button>
  );
});

const LinkedInIcon = () => (
  <FontAwesomeIcon
    icon={faLinkedInSquare}
    style={{ marginTop: 10, color: '#3B5998', fontSize: 40 }}
    onClick={linkedInLogin}
  />
);

const LinkedInComponent = ({ text, type }) => {
  switch (type) {
    case 'button':
      return <LinkedInButton text={text} />;
    case 'link':
      return <LinkedInLink text={text} />;
    case 'icon':
      return <LinkedInIcon />;
    default:
      return <LinkedInButton text={text} />;
  }
};

LinkedInComponent.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default LinkedInComponent;
