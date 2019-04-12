import fs from 'fs';
import shell from 'shelljs';
import { moveToModules } from '../helpers/util';
import { BASE_PATH } from '../config';

const deleteStack = stacks => {
  const route = moveToModules('modules');
  const dirsList = getPathsDirectory(route);
  stacks.forEach(stack => {
    handleDeleteDirectory(`${BASE_PATH}/packages/${stack}`);
    dirsList.forEach(dir => {
      handleDeleteDirectory(`${dir}/${stack}`);
    });
  });
};

const handleDeleteDirectory = path => {
  try {
    shell.rm('-rf', path);
  } catch (e) {
    console.log('Stack not found');
  }
};

const getPathsDirectory = route => {
  const listDirPaths = [];
  const elements = fs.readdirSync(route);
  elements.forEach(element => {
    if (!fs.statSync(`${route}/${element}`).isFile()) {
      listDirPaths.push(`${route}/${element}`);
    }
  });
  return listDirPaths;
};

export default deleteStack;
