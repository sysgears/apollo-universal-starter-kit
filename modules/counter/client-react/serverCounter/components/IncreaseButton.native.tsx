import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { Button, primary } from '@gqlapp/look-client-react-native';

interface ButtonProps {
  onClick: () => any;
  t: TranslateFunction;
}

const IncreaseButton = ({ onClick, t }: ButtonProps) => (
  <Button type={primary} onPress={onClick}>
    {t('btnLabel')}
  </Button>
);

export default translate('serverCounter')(IncreaseButton);
