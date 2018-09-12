import React from 'react';

import { TranslateFunction } from '../../../../../i18n';
import { Button, Alert, CardGroup, CardTitle, CardText } from '../../../../common/components/web';

interface CancelSubscriptionViewProps {
  loading: boolean;
  active: boolean;
  onClick: () => void;
  errors: string;
  cancelling: boolean;
  t: TranslateFunction;
}

export default ({ loading, active, t, onClick, errors, cancelling }: CancelSubscriptionViewProps) => {
  if (loading) {
    return <p>{t('loading')}</p>;
  }

  return (
    <CardGroup>
      <CardTitle>{t('cancel.title')}</CardTitle>
      <CardText>
        {active && (
          <Button color="danger" onClick={onClick} disabled={cancelling}>
            {t('cancel.btn')}
          </Button>
        )}
        {!active && <span>{t('cancel.msg')}</span>}
        {errors && <Alert color="error">{errors}</Alert>}
      </CardText>
    </CardGroup>
  );
};
