import modules from '../client/src/modules';
import { ANTD_COMPONENTS } from '../client/src/modules/ui-antd/components/index';
import { BOOTSTRAP_COMPONENTS } from '../client/src/modules/ui-bootstrap/components/index';

const stylesProviders = [
  {
    name: 'bootstrap',
    components: BOOTSTRAP_COMPONENTS
  },
  {
    name: 'antd',
    components: ANTD_COMPONENTS
  }
];

const uiComponents = () => {
  return stylesProviders.find((provider: any) => provider.name === modules.stylesProviders[0]).components;
};

export default uiComponents;
