import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../../common/components/web';

const CardInfoView = ({ loading, expiryMonth, expiryYear, last4, brand }) => {
  return (
    <div>
      {!loading &&
        expiryMonth &&
        expiryYear &&
        last4 &&
        brand && (
          <div>
            <h4>Card Info</h4>
            <p>
              card: {brand} ************{last4}
            </p>
            <p>
              expires: {expiryMonth}/{expiryYear}
            </p>
            <Link to="/update-card">
              <Button color="primary">Update Card</Button>
            </Link>
          </div>
        )}
    </div>
  );
};

CardInfoView.propTypes = {
  loading: PropTypes.bool.isRequired,
  expiryMonth: PropTypes.number,
  expiryYear: PropTypes.number,
  last4: PropTypes.string,
  brand: PropTypes.string
};

export default CardInfoView;
