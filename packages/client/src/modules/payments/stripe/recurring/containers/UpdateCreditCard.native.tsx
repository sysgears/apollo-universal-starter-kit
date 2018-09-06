import React from 'react';

import UpdateCreditCardView from '../components/UpdateCreditCardView';
import translate from '../../../../../i18n';

const UpdateSubscription = (props: any) => {
  return <UpdateCreditCardView {...props} />;
};

export default translate('subscription')(UpdateSubscription);
