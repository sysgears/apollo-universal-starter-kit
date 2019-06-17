import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { ClientCounterView } from '@gqlapp/counter-client-react/clientCounter/components/ClientCounterView';

const { Button, Welcome } = require('@storybook/react/demo');

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <ClientCounterView text="123">abc</ClientCounterView>);
