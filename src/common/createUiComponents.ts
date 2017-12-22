import { modules } from '../client/app/components';
import { ANTD_COMPONENTS } from '../client/modules/ui-antd/components';
import { BOOTSTRAP_COMPONENTS } from '../client/modules/ui-bootstrap/components';

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

export const uiComponents = () => {
  return stylesProviders.find((provider: any) => provider.name === modules.stylesProviders[0]).components;
};
