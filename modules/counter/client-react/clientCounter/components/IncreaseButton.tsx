import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { Button } from '@gqlapp/look-client-react';

interface ButtonProps {
  onClick: () => any;
  t: TranslateFunction;
}

const IncreaseButton = ({ onClick, t }: ButtonProps) => (
  <Button color="primary" onClick={onClick}>
    {t('btnLabel')}
  </Button>
);

export default translate('clientCounter')(IncreaseButton);
