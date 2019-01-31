import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import faGithubSquare from '@fortawesome/fontawesome-free-brands/faGithubSquare';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button } from '@gqlapp/look-client-react';

import './GitHubButton.css';

const githubLogin = () => {
  window.location = '/auth/github';
};

const GitHubButton = withApollo(({ text }) => {
  return (
    <Button type="button" size="lg" onClick={githubLogin} className="githubBtn">
      <div className="iconContainer">
        <FontAwesomeIcon icon={faGithubSquare} className="githubIcon" />
        <div className="separator" />
      </div>
      <div className="btnText">
        <span>{text}</span>
      </div>
    </Button>
  );
});

const GitHubLink = withApollo(({ text }) => {
  return (
    <Button color="link" onClick={githubLogin} style={{ marginTop: 10 }}>
      {text}
    </Button>
  );
});

const GitHubIcon = () => (
  <FontAwesomeIcon
    icon={faGithubSquare}
    style={{ marginTop: 10, color: '#5f5e5e', fontSize: 40 }}
    onClick={githubLogin}
  />
);

const GithubComponent = ({ text, type }) => {
  switch (type) {
    case 'button':
      return <GitHubButton text={text} />;
    case 'link':
      return <GitHubLink text={text} />;
    case 'icon':
      return <GitHubIcon />;
    default:
      return <GitHubButton text={text} />;
  }
};

GithubComponent.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default GithubComponent;
