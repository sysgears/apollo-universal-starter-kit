import 'dotenv/config';
import modules from './modules';

(async () => {
  await modules.createApp(module);
})();

export default modules;
