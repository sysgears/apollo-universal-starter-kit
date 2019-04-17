import { moveToModules, handleDeleteDirectory, getPathsDirectory } from './util';
import { BASE_PATH } from '../config';

/**
 * Delete unused stack of technologies
 *
 * @param stackList - List unused stack of technologies
 */
const deleteStack = stackList => {
  const route = moveToModules('modules');
  const dirsList = getPathsDirectory(route);
  stackList.forEach(stack => {
    handleDeleteDirectory(`${BASE_PATH}/packages/${stack}`);
    dirsList.forEach(dir => {
      handleDeleteDirectory(`${dir}/${stack === 'server' ? 'server-ts' : stack}`);
    });
  });
};

export default deleteStack;
