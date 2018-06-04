import React from 'react';
import { withApollo } from 'react-apollo';
import faFacebookSquare from '@fortawesome/fontawesome-free-brands/faFacebookSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '../../../../common/components/web';
import access from '../../../access';
import './FacebookButton.css';

const facebookLogin = () => {
  window.location = '/auth/facebook';
};

const FacebookButton = withApollo(({ client, text }) => {
  return (
    <Button type="button" size="lg" onClick={() => access.doLogin(client).then(facebookLogin)} className="facebookBtn">
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

const FacebookLink = withApollo(({ client, text }) => {
  return (
    <Button color="link" onClick={() => access.doLogin(client).then(facebookLogin)} style={{ marginTop: 10 }}>
      {text}
    </Button>
  );
});

const FacebookIcon = withApollo(({ client }) => {
  return (
    <FontAwesomeIcon
      icon={faFacebookSquare}
      style={{ marginTop: 10, color: '#17427e', fontSize: 40 }}
      onClick={() => access.doLogin(client).then(facebookLogin)}
    />
  );
});

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

export default FacebookComponent;
