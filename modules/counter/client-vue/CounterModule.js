import ClientModule from '@gqlapp/module-client-vue';

class CounterModule extends ClientModule {
  constructor(...modules) {
    super(...modules);
  }
}

export default CounterModule;
