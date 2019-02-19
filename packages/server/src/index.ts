import 'dotenv/config';
import modules from './modules';

(async () => {
  await modules.createAppContext();
  modules.createApp(module);
})();

export default modules;
