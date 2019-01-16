import ClientModule from '@module/module-client-vue';
import core from '@module/core-client-vue';
import counter from '@module/counter-client-vue';

const modules = new ClientModule(core, counter);

export default modules;
