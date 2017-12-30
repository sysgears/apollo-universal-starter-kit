import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, CardGroup, CardTitle, CardText } from '../../common/components/web';

const CardInfoView = ({ loading, expiryMonth, expiryYear, last4, brand }) => {
  return (
    <div>
      {!loading &&
        expiryMonth &&
        expiryYear &&
        last4 &&
        brand && (
          <CardGroup>
            <CardTitle>Card Info</CardTitle>
            <CardText>
              card: {brand} ************{last4}
            </CardText>
            <CardText>
              expires: {expiryMonth}/{expiryYear}
            </CardText>
            <CardText>
              <Link to="/update-card">
                <Button color="primary">Update Card</Button>
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
  brand: PropTypes.string
};

export default CardInfoView;
