import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import translate from '../../../i18n';
import { PageLayout, Button } from '../../common/components/web';
import settings from '../../../../../../settings';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

const CounterView = ({
  loading,
  counter,
  addCounter,
  reduxCount,
  onReduxIncrement,
  counterState,
  addCounterState,
  t
}) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('meta')}`
        }
      ]}
    />
  );

  if (loading) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('loading')}</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Section>
          <p>{t('counter.text', { counter })}</p>
          <Button id="graphql-button" color="primary" onClick={addCounter(1)}>
            {t('counter.btnLabel')}
          </Button>
        </Section>
        <Section>
          <p>{t('reduxCount.text', { reduxCount })}</p>
          <Button id="redux-button" color="primary" onClick={onReduxIncrement(1)}>
            {t('reduxCount.btnLabel')}
          </Button>
        </Section>
        <Section>
          <p>{t('apolloCount.text', { counterState })}</p>
          <Button id="apollo-link-button" color="primary" onClick={addCounterState(1)}>
            {t('apolloCount.btnLabel')}
          </Button>
        </Section>
      </PageLayout>
    );
  }
};

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  addCounter: PropTypes.func.isRequired,
  counterState: PropTypes.number.isRequired,
  addCounterState: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('counter')(CounterView);
