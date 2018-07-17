import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout } from '../../common/components/web';
import settings from '../../../../../../settings';
import translate from '../../../i18n';
import {
  ClientCounterContainer as ClientCounter,
  ServerCounterContainer as ServerCounter,
  ReduxCounterContainer as ReduxCounter
} from '..';

class Counter extends React.Component {
  static propTypes = {
    t: PropTypes.func
  };

  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const { t } = this.props;

    return (
      <PageLayout>
        <Helmet
          title={`${settings.app.name} - ${t('title')}`}
          meta={[
            {
              name: 'description',
              content: `${settings.app.name} - ${t('meta')}`
            }
          ]}
        />
        <ServerCounter />
        <ReduxCounter />
        <ClientCounter />
      </PageLayout>
    );
  }
}

export default translate('counter')(Counter);
