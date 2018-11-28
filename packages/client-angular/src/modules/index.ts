import counter from '@module/counter-client-angular';
import ClientModule from '@module/module-client-angular';

const modules = new ClientModule(counter);
modules.triggerOnCreate();

export default modules;
