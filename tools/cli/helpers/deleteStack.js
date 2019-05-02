import { moveToDirectory, handleDeleteDirectory, getPathsDirectory } from './util';
import { BASE_PATH } from '../config';

/**
 * Delete unused stack of technologies
 *
 * @param unusedStackList - List unused stack of technologies
 */
const deleteStack = unusedStackList => {
  const route = moveToDirectory('modules');
  const dirsList = getPathsDirectory(route);
  unusedStackList.forEach(stack => {
    handleDeleteDirectory(`${BASE_PATH}/packages/${stack}`);
    dirsList.forEach(dir => {
      handleDeleteDirectory(`${dir}/${stack}`);
    });
  });
};

export default deleteStack;
