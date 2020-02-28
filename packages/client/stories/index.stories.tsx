import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient } from '@gqlapp/core-common';
import i18n from '@gqlapp/i18n-client-react';
import ClientModule from '@gqlapp/module-client-react';
import clientCounter from '@gqlapp/counter-client-react/clientCounter';

const modules = new ClientModule(i18n, clientCounter);
(async () => modules.createApp(module))();

const client = createApolloClient({
  createLink: modules.createLink,
  clientResolvers: modules.resolvers
});

const { Button, Welcome } = require('@storybook/react/demo');
const CounterComponent: React.FC = () => modules.counterComponent;

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
storiesOf('Client Counters', module).add('Apollo Link', () => (
  <ApolloProvider client={client}>
    <CounterComponent />
  </ApolloProvider>
));
