import React from 'react';
import { Link } from 'react-router-dom';
import { TranslateFunction } from '../../../../../i18n';
import { Button, CardGroup, CardTitle, CardText } from '../../../../common/components/web';

interface CardInfoViewProps {
  loading: boolean;
  expiryMonth: number;
  expiryYear: number;
  last4: string;
  brand: string;
  t: TranslateFunction;
}

export default ({ loading, expiryMonth, expiryYear, last4, brand, t }: CardInfoViewProps) => (
  <div>
    {!loading &&
      expiryMonth &&
      expiryYear &&
      last4 &&
      brand && (
        <CardGroup>
          <CardTitle>{t('card.title')}</CardTitle>
          <CardText>
            {t('card.text.card')}: {brand} ************
            {last4}
          </CardText>
          <CardText>
            {t('card.text.expires')}: {expiryMonth}/{expiryYear}
          </CardText>
          <CardText>
            <Link to="/update-card">
              <Button color="primary">{t('card.btnUpdate')}</Button>
            </Link>
          </CardText>
        </CardGroup>
      )}
  </div>
);
