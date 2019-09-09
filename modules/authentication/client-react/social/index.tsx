import React from 'react';
import { faFacebookSquare, faGithubSquare, faGooglePlusSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import SocialAuthComponent from './containers/SocialAuthComponent';

interface ComponentProps {
  text: string;
  type: string;
}

const FacebookButton = (props: ComponentProps) => (
  <SocialAuthComponent
    serverAuthUrl="/auth/facebook"
    icon={faFacebookSquare}
    backgroundColor="#3769ae"
    hoverColor="#17427e"
    {...props}
  />
);

const GitHubButton = (props: ComponentProps) => (
  <SocialAuthComponent
    serverAuthUrl="/auth/github"
    icon={faGithubSquare}
    backgroundColor="#464646"
    hoverColor="#5f5e5e"
    {...props}
  />
);

const GoogleButton = (props: ComponentProps) => (
  <SocialAuthComponent
    serverAuthUrl="/auth/google"
    icon={faGooglePlusSquare}
    backgroundColor="#c43832"
    hoverColor="#aa1c17"
    {...props}
  />
);

const LinkedInButton = (props: ComponentProps) => (
  <SocialAuthComponent
    serverAuthUrl="/auth/linkedin"
    icon={faLinkedin}
    backgroundColor="#0077b0"
    hoverColor="#054b6b"
    {...props}
  />
);

export { FacebookButton, GitHubButton, GoogleButton, LinkedInButton };
