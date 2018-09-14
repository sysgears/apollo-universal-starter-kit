import React from 'react';

import { TranslateFunction } from '../../../../../i18n';
import { Button, Alert, CardGroup, CardTitle, CardText } from '../../../../common/components/web';

interface CancelSubscriptionViewProps {
  onClick: () => void;
  errors: string;
  cancelling: boolean;
  t: TranslateFunction;
}

export default ({ t, onClick, errors, cancelling }: CancelSubscriptionViewProps) => {
  return (
    <CardGroup>
      <CardTitle>{t('cancel.title')}</CardTitle>
      <CardText>
        <Button color="danger" onClick={onClick} disabled={cancelling}>
          {t('cancel.btn')}
        </Button>
        {errors && <Alert color="error">{errors}</Alert>}
      </CardText>
    </CardGroup>
  );
};
