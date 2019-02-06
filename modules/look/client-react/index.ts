import ClientModule from '@gqlapp/module-client-react';

/* Bootstrap */
import look from './ui-bootstrap';
export * from './ui-bootstrap';

/* Material UI */
// import look from './ui-material';
// export * from './ui-material';

/* Antd */
// import look from './ui-antd'
// export * from './ui-antd';

export { default as LayoutCenter } from './LayoutCenter';

export default new ClientModule(look);
