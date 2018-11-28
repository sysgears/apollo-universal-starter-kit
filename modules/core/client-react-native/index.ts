import ClientModule from '@module/module-client-react-native';

const onCreate = (modules: ClientModule): void => {
  try {
    // tslint:disable-next-line
    require('./AwakeInDevApp').default(modules);
  } catch (e) {
    if (typeof ErrorUtils !== 'undefined') {
      (ErrorUtils as any).reportFatalError(e);
    } else {
      console.error(e);
    }
  }
};

export default new ClientModule({
  onCreate: [onCreate]
});
