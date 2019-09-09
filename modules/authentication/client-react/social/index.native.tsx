import React from 'react';

import SocialAuthComponent from './containers/SocialAuthComponent.native';

interface ComponentProps {
  text: string;
  type: string;
}

const FacebookButton = (props: ComponentProps) => (
  <SocialAuthComponent authUrl="/auth/facebook" icon="facebook-square" backgroundColor="#3769ae" {...props} />
);

const GitHubButton = (props: ComponentProps) => (
  <SocialAuthComponent authUrl="/auth/github" icon="github-square" backgroundColor="#464646" {...props} />
);

const GoogleButton = (props: ComponentProps) => (
  <SocialAuthComponent authUrl="/auth/google" icon="google-plus-square" backgroundColor="#c43832" {...props} />
);

const LinkedInButton = (props: ComponentProps) => (
  <SocialAuthComponent authUrl="/auth/linkedin" icon="linkedin-square" backgroundColor="#0077b0" {...props} />
);

export { FacebookButton, GitHubButton, GoogleButton, LinkedInButton };
