import core from '@module/core-client-angular';
import counter from '@module/counter-client-angular';
import ClientModule from '@module/module-client-angular';

const modules = new ClientModule(core, counter);
modules.triggerOnCreate();
