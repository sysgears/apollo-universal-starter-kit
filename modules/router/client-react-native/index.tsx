import React from 'react';
import { createDrawerNavigator, NavigationContainer } from 'react-navigation';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import { Provider } from '@ant-design/react-native';

import ClientModule from '@gqlapp/module-client-react-native';
import { DrawerComponent } from '@gqlapp/look-client-react-native';

const ref: { navigator: NavigationContainer } = { navigator: null };

const MainScreenNavigator = () => {
  const Navigator = ref.navigator;

  class App extends React.Component {
    public render() {
      return (
        <Provider>
          <Navigator />
        </Provider>
      );
    }
  }
  return <App />;
};

export default new ClientModule({
  router: <MainScreenNavigator />,
  onAppCreate: [
    async (modules: ClientModule) =>
      (ref.navigator = createDrawerNavigator(
        {
          ...modules.drawerItems
        },
        {
          // eslint-disable-next-line
          contentComponent: props => <DrawerComponent {...props} drawerItems={modules.drawerItems} />
        }
      ))
  ]
});
