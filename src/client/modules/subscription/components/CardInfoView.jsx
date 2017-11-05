import React from 'react';
import PropTypes from 'prop-types';

const CardInfoView = ({ loading, expiryMonth, expiryYear, last4, brand }) => {
  return (
    <div>
      <h4>Card Info</h4>
      {!loading && (
        <div>
          <p>
            card: {brand} ************{last4}
          </p>
          <p>
            expires: {expiryMonth}/{expiryYear}
          </p>
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
