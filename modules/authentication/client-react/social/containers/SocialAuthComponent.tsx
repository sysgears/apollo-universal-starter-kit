import React from 'react';
import styled from 'styled-components';

import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@gqlapp/look-client-react';

const StyledButton = styled(({ backgroundColor, hoverColor, ...other }) => <Button {...other} />)`
  min-width: 320px;
  margin-top: 10px;
  background-color: ${props => props.backgroundColor};
  border-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    background-color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex: 1 1 10%;
  justify-content: flex-start;
  align-items: center;
`;

const Separator = styled.div`
  height: 28px;
  width: 1px;
  background-color: #fff !important;
  margin-left: 10px;
`;

const ButtonLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 5;
`;

const ButtonIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 30px;
`;

const redirectToSocialLogin = (serverAuthUrl: string) => (window.location.href = serverAuthUrl);

interface ButtonProps {
  serverAuthUrl: string;
  text: string;
  backgroundColor: string;
  hoverColor: string;
  icon: IconDefinition;
}

const SocialAuthButton = ({ text, backgroundColor, hoverColor, icon, serverAuthUrl }: ButtonProps) => (
  <StyledButton
    backgroundColor={backgroundColor}
    hoverColor={hoverColor}
    type="button"
    size="lg"
    onClick={() => redirectToSocialLogin(serverAuthUrl)}
  >
    <IconContainer>
      <ButtonIcon icon={icon} />
      <Separator />
    </IconContainer>
    <ButtonLabel>
      <span>{text}</span>
    </ButtonLabel>
  </StyledButton>
);

interface LinkProps {
  serverAuthUrl: string;
  text: string;
}

const StyledLinkButton = styled(Button)`
  margin-top: 10px;
`;

const SocialAuthLink = ({ text, serverAuthUrl }: LinkProps) => (
  <StyledLinkButton color="link" onClick={() => redirectToSocialLogin(serverAuthUrl)}>
    {text}
  </StyledLinkButton>
);

interface IconProps {
  serverAuthUrl: string;
  icon: IconDefinition;
  backgroundColor: string;
}

const Icon = styled(FontAwesomeIcon)`
  margin-top: 10px;
  color: ${props => props.backgroundColor}
  font-size: 40px;
`;

const SocialAuthIcon = ({ icon, backgroundColor, serverAuthUrl }: IconProps) => (
  <Icon backgroundColor={backgroundColor} icon={icon} onClick={() => redirectToSocialLogin(serverAuthUrl)} />
);

interface ComponentProps {
  text: string;
  type: string;
  icon: IconDefinition;
  backgroundColor: string;
  hoverColor: string;
  serverAuthUrl: string;
}

const SocialAuthComponent = (props: ComponentProps) => {
  switch (props.type) {
    case 'button':
      return <SocialAuthButton {...props} />;
    case 'link':
      return <SocialAuthLink {...props} />;
    case 'icon':
      return <SocialAuthIcon {...props} />;
    default:
      return <SocialAuthButton {...props} />;
  }
};

export default SocialAuthComponent;
