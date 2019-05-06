import fs from 'fs';
import chalk from 'chalk';
import { deleteStackDir } from '../helpers/util';

import { STACK_MAP, BASE_PATH } from '../config';

/**
 * Handler delete technology stack command
 *
 * @param {Array} stackList - The list of technologies
 * @param {Function} logger - The Logger
 * @param {Boolean} isShowStackList - The flag to show list of existing technologies
 */
const handleDeleteStackCommand = (stackList, logger, isShowStackList) => {
  if (isShowStackList) {
    displayStackList(logger);
  } else if (checkStackList(stackList, logger)) {
    deleteStack(stackList.map(stack => stack.toLowerCase()), logger);
  }
};

/**
 * Display the list of technologies
 *
 * @param {Function} logger - The Logger
 */
const displayStackList = logger => {
  // getting a list of existing technologies
  const existsStackList = getExistsStackList();

  logger.info(chalk.yellow(`List exists stack of technology: ${existsStackList.join(', ')}`));
};

/**
 * Delete a list of technologies
 *
 * @param {Array} stackList - The technology list selected by user
 */
const deleteStack = stackList => {
  const stackDirectoryList = collectStackDirectory(stackList);
  deleteStackDir(stackDirectoryList);
};

/**
 * Collect full list of technology
 *
 * @param {Array} stackList - The list of technologies
 * @returns {Array} - The full list of stack directories
 */
const collectStackDirectory = stackList => {
  let stackDirectoryList = [];

  for (let stack in STACK_MAP) {
    if (stackList.includes(STACK_MAP[stack].name)) {
      stackDirectoryList = [...stackDirectoryList, ...STACK_MAP[stack].subdirs];
    }
  }

  return stackDirectoryList;
};

/**
 * Getting a list of existing technologies
 */
const getExistsStackList = () =>
  fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => Object.keys(STACK_MAP).includes(stack))
    .map(stack => STACK_MAP[stack].name);

/**
 * Checking the list of technologies selected by user
 *
 * @param {Array} stackList - The technology list selected by user
 * @param {Function} logger - The Logger
 * @returns {Boolean}
 */
const checkStackList = (stackList, logger) => {
  // getting a list of existing technologies
  const existsStackList = getExistsStackList();

  // check on the stackList in the existsStackList
  const notExistsStackList = stackList
    // create non-existent list of technology
    .reduce((acc, curr) => (existsStackList.includes(curr) ? acc : [...acc, curr]), []);

  if (notExistsStackList.length) {
    // show a log in shell for non-existent technology stack
    logger.error(chalk.red(`The technology stack "${notExistsStackList.join(', ')}" not exists.`));
    logger.error(chalk.yellow(`Please enter correct technology stack`));
    return false;
  }

  return true;
};

module.exports = handleDeleteStackCommand;
