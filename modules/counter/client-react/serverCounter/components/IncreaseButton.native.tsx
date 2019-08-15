import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { Button, primary } from '@gqlapp/look-client-react-native';

interface ButtonProps {
  onClick: () => any;
  text: string;
  t: TranslateFunction;
}

const IncreaseButton = ({ onClick, text }: ButtonProps) => (
  <Button type={primary} onPress={onClick}>
    {text}
  </Button>
);

export default translate('serverCounter')(IncreaseButton);
