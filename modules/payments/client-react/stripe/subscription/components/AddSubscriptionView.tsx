import React from 'react';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { PageLayout, LayoutCenter, Table, Row, Col } from '@gqlapp/look-client-react';
import { clientOnly } from '@gqlapp/core-client-react';
import settings from '@gqlapp/config';

import SubscriptionCardForm from './SubscriptionCardFormView';
import { CreditCardInput } from '../types';

const ElementsClientOnly = clientOnly(Elements);

interface AddSubscriptionViewProps {
  t: TranslateFunction;
  submitting: boolean;
  onSubmit: (subscriptionInput: CreditCardInput, stripe: any) => void;
}

export default (props: AddSubscriptionViewProps) => {
  const { t } = props;

  return (
    <PageLayout>
      <Helmet title={`${settings.app.name} - ${t('title')}`} />
      <h1 className="text-center">{t('title')}</h1>
      <Row style={{ justifyContent: 'center' }}>
        <Col xs={12} md={10}>
          <p className="text-center">{t('add.description')}</p>
          <p className="text-center">{t('add.product')}</p>
          <p className="text-center">
            {t('add.price')}
            {settings.stripe.subscription.plan.amount / 100}
          </p>
        </Col>
        <Col xs={12} md={12}>
          <LayoutCenter>
            <h3 className="text-center"> {t('add.creditCard')}</h3>
            <ElementsClientOnly>
              <SubscriptionCardForm {...props} buttonName={t('add.btn')} />
            </ElementsClientOnly>
          </LayoutCenter>
        </Col>
        <Col xs={12} md={8}>
          <hr />
          {/* Displays testing credit cards when stripe test keys are used!!!*/}
          {settings.stripe.subscription.publicKey.includes('test') && renderTestingCards(t)}
        </Col>
      </Row>
    </PageLayout>
  );
};

/**
 * Renders test credit cards table.
 *
 * @param t - The translate function.
 * @return Returns header and table with test credit cards
 */
const renderTestingCards = (t: TranslateFunction) => {
  const testCreditCard = [
    {
      id: 1,
      number: '4242 4242 4242 4242',
      type: 'visa',
      date: '02/22',
      csv: '242',
      zip: '42424'
    },
    {
      id: 2,
      number: '5555 5555 5555 4444',
      type: 'Mastercard',
      date: '02/22',
      csv: '242',
      zip: '42424'
    },
    {
      id: 3,
      number: '3782 8224 6310 005',
      type: 'American Express',
      date: '02/22',
      csv: '242',
      zip: '42424'
    }
  ];

  const columns = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      render(text: string) {
        return <span>{text}</span>;
      }
    },
    {
      title: 'number',
      dataIndex: 'number',
      key: 'number',
      render(text: string) {
        return <span>{text}</span>;
      }
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
      render(text: string) {
        return <span>{text}</span>;
      }
    },
    {
      title: 'csv',
      dataIndex: 'csv',
      key: 'csv',
      render(text: string) {
        return <span>{text}</span>;
      }
    },
    {
      title: 'zip',
      dataIndex: 'zip',
      key: 'zip',
      render(text: string) {
        return <span>{text}</span>;
      }
    }
  ];

  return (
    <div>
      <h3 className="text-center">{t('add.testCreditCards')}</h3>
      <Table dataSource={testCreditCard} columns={columns} />
    </div>
  );
};
