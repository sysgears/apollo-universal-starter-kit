import React from 'react';

import { translate, TranslateFunction } from '@module/i18n-client-react';
import $Module$View from '../components/$Module$View';

interface $Module$Props {
  t: TranslateFunction;
}

class $Module$ extends React.Component<$Module$Props> {
  public render() {
    return <$Module$View {...this.props} />;
  }
}

export default translate('$module$')($Module$);
