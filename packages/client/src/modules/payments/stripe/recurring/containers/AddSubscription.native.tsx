import React from 'react';

import AddSubscriptionView from '../components/AddSubscriptionView';
import translate from '../../../../../i18n';

const AddSubscription = (props: any) => {
  return <AddSubscriptionView {...props} />;
};

export default translate('subscription')(AddSubscription);
