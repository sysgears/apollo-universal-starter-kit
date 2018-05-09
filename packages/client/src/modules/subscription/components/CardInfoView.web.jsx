import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import translate from '../../../i18n';
import { Button, CardGroup, CardTitle, CardText } from '../../common/components/web';

const CardInfoView = ({ loading, expiryMonth, expiryYear, last4, brand, t }) => {
  return (
    <div>
      {!loading &&
        expiryMonth &&
        expiryYear &&
        last4 &&
        brand && (
          <CardGroup>
            <CardTitle>{t('card.title')}</CardTitle>
            <CardText>
              {t('card.text.card')}: {brand} ************{last4}
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
};

CardInfoView.propTypes = {
  loading: PropTypes.bool.isRequired,
  expiryMonth: PropTypes.number,
  expiryYear: PropTypes.number,
  last4: PropTypes.string,
  brand: PropTypes.string,
  t: PropTypes.func
};

export default translate('subscription')(CardInfoView);
