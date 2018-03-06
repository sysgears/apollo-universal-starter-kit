import { UserTabNavigator } from '../modules/user';
import modules from '../modules';

{
  /*
    Custom TabNavigator implementation that allows to
    restrict access to some specific tabs based on a user role.
*/
}
export default UserTabNavigator(modules.tabItems);

{
  /* This is default implementation of tab navigator.
   To use it uncomment this snippet.

    const MainScreenNavigator = TabNavigator({
        ...modules.tabItems
    });

    export default MainScreenNavigator;   
*/
}
