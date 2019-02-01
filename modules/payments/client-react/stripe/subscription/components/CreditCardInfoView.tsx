import React from 'react';
import { Link } from 'react-router-dom';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { Button, CardGroup, CardTitle, CardText } from '@gqlapp/look-client-react';

interface CardInfoViewProps {
  loading: boolean;
  creditCard: {
    expiryMonth: number;
    expiryYear: number;
    last4: string;
    brand: string;
  };
  t: TranslateFunction;
}

export default ({ loading, t, creditCard }: CardInfoViewProps) => {
  return (
    <div>
      {!loading &&
        creditCard &&
        creditCard.expiryMonth &&
        creditCard.expiryYear &&
        creditCard.last4 &&
        creditCard.brand && (
          <CardGroup>
            <CardTitle>{t('creditCard.title')}</CardTitle>
            <CardText>
              {t('creditCard.text.card')}: {creditCard.brand} ************
              {creditCard.last4}
            </CardText>
            <CardText>
              {t('creditCard.text.expires')}: {creditCard.expiryMonth}/{creditCard.expiryYear}
            </CardText>
            <CardText>
              <Link to="/update-credit-card">
                <Button color="primary">{t('update.btn')}</Button>
              </Link>
            </CardText>
          </CardGroup>
        )}
    </div>
  );
};
