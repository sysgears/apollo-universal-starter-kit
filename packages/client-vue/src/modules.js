import ClientModule from '@gqlapp/module-client-vue';
import core from '@gqlapp/core-client-vue';
import counter from '@gqlapp/counter-client-vue';

const modules = new ClientModule(core, counter);

export default modules;
