import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { storiesOf } from '@storybook/react';
import addons from '@storybook/addons';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, text } from '@storybook/addon-knobs';
import { LOCALE_EVENT_NAME } from 'storybook-addon-locale';
import i18next from 'i18next';
import i18n from '@gqlapp/i18n-client-react';
import { createApolloClient } from '@gqlapp/core-common';
import ClientModule from '@gqlapp/module-client-react';
import clientCounter from '@gqlapp/counter-client-react/clientCounter';
import config from '@gqlapp/config';

// Trigger locale change using  storybook-addon-locale's event emitter
const channel = addons.getChannel();
channel.on(LOCALE_EVENT_NAME, l => {
  i18next.changeLanguage(`${l.locale}`); // fully qualified i18n names apparently needed
});

// Standard storybook Welcome and buttons, but with knobs enabled for text label button.
const { Welcome, Button } = require('@storybook/react/demo');
storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => {
    const msgTxt = text('Label', 'Hello Button');
    return <Button onClick={action('clicked')}>{`${msgTxt}`}</Button>;
  })
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

// Client counter with i18n translation & storybook locale addon for language selection
const clientCounterModule = new ClientModule(i18n, clientCounter);
(async () => clientCounterModule.createApp(module))();
const CounterComponent: React.FC = () => clientCounterModule.counterComponent;
const client = createApolloClient({
  createLink: clientCounterModule.createLink,
  clientResolvers: clientCounterModule.resolvers
});
storiesOf('Client Counters', module)
  .addParameters({
    locales: config.i18n.langList,
    defaultLocale: config.i18n.langList[0],
    enableLocaleLockButton: false
  })
  .add('Apollo Link', () => (
    <ApolloProvider client={client}>
      <CounterComponent />
    </ApolloProvider>
  ));
