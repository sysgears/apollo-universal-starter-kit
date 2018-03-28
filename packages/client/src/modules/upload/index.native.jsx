import { Ionicons } from '@expo/vector-icons';
import { createApolloFetch } from 'apollo-fetch';
import { constructUploadOptions } from 'apollo-fetch-upload';

import { createTabBarIconWrapper } from '../common/components/native';
import Upload from './containers/Upload';
import reducers from './reducers';
import Feature from '../connector';

export default new Feature({
  catalogInfo: { upload: true },
  tabItem: {
    Upload: {
      screen: Upload,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { upload: reducers },
  fetch: createApolloFetch({
    uri: __API_URL__,
    constructOptions: (reqs, options) => ({
      ...constructUploadOptions(reqs, options),
      credentials: 'include'
    })
  })
});
