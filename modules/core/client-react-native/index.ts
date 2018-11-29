import ClientModule from '@module/module-client-react-native';
import onCreate from './AwakeInDevApp';

export default new ClientModule({
  onCreate: [onCreate]
});
