import core from '@gqlapp/core-client-angular';
import counter from '@gqlapp/counter-client-angular';
import look from '@gqlapp/look-client-angular';
import ClientModule from '@gqlapp/module-client-angular';

const modules = new ClientModule(core, look, counter);

export default modules;
