import React from 'react';
import { withApollo } from 'react-apollo';
import faLinkedInSquare from '@fortawesome/fontawesome-free-brands/faLinkedin';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '@module/look-client-react';
import access from '../../../access';
import './LinkedInButton.css';

const linkedInLogin = () => {
  window.location = '/auth/linkedin';
};

const LinkedInButton = withApollo(({ client, text }) => {
  return (
    <Button type="button" size="lg" onClick={() => access.doLogin(client).then(linkedInLogin)} className="linkedInBtn">
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

const LinkedInLink = withApollo(({ client, text }) => {
  return (
    <Button color="link" onClick={() => access.doLogin(client).then(linkedInLogin)} style={{ marginTop: 10 }}>
      {text}
    </Button>
  );
});

const LinkedInIcon = withApollo(({ client }) => {
  return (
    <FontAwesomeIcon
      icon={faLinkedInSquare}
      style={{ marginTop: 10, color: '#3B5998', fontSize: 40 }}
      onClick={() => access.doLogin(client).then(linkedInLogin)}
    />
  );
});

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

export default LinkedInComponent;
