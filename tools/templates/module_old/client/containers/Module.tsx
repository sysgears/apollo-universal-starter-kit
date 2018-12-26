import React from 'react';

import $Module$View from '../components/$Module$View';
import translate, { TranslateFunction } from '../../../i18n';

interface $Module$Props {
  t: TranslateFunction;
}

class $Module$ extends React.Component<$Module$Props> {
  public render() {
    return <$Module$View {...this.props} />;
  }
}

export default translate('$module$')($Module$);
