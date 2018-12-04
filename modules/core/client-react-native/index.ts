import ClientModule from '@module/module-client-react-native';
import onAppCreate from './AwakeInDevApp';

export default new ClientModule({
  onAppCreate: [onAppCreate]
});
