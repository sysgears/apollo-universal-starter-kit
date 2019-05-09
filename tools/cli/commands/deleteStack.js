import fs from 'fs';
import chalk from 'chalk';
import { deleteStackDir } from '../helpers/util';

import { STACK_MAP, BASE_PATH } from '../config';

/**
 * This function, depending on the command entered,
 * determines whether to display a list of technologies
 * or delete them.
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
 * Displays the list of technologies
 *
 * @param {Function} logger - The Logger
 */
const displayStackList = logger => {
  // getting a list of existing technologies
  const existingStackList = getExistingStackList();

  logger.info(chalk.yellow(`Existing technology stack list: ${existingStackList.join(', ')}`));
};

/**
 * Deletes a list of technologies
 *
 * @param {Array} stackList - The technology list selected by user
 */
const deleteStack = stackList => {
  const stackDirList = collectStackDirList(stackList);
  deleteStackDir(stackDirList);
};

/**
 * Collects full list of technology
 *
 * @param {Array} stackList - The list of technologies
 * @returns {Array} - The full list of stack directories
 */
const collectStackDirList = stackList => {
  const stackDirList = Object.keys(STACK_MAP).reduce(
    (acc, curr) => (!stackList.includes(STACK_MAP[curr].name) ? acc : [...acc, ...STACK_MAP[curr].subdirs]),
    []
  );

  return stackDirList;
};

/**
 * Gets a list of existing technologies
 */
const getExistingStackList = () =>
  fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => Object.keys(STACK_MAP).includes(stack))
    .map(stack => STACK_MAP[stack].name);

/**
 * Checks the list of technologies selected by the user
 *
 * @param {Array} stackList - The technology list selected by user
 * @param {Function} logger - The Logger
 * @returns {Boolean}
 */
const checkStackList = (stackList, logger) => {
  // getting a list of existing technologies
  const existingStackList = getExistingStackList();

  // technology stack list supported by the kit, but not currently preset in a project
  const notExistingStackList = stackList.filter(stack => !existingStackList.includes(stack));

  if (notExistingStackList.length) {
    // show a log in the shell for non-existent technology stack
    logger.error(chalk.red(`The technology stack "${notExistingStackList.join(', ')}" does not exists.`));
    logger.error(chalk.yellow(`Please enter correct technology stack`));
    return false;
  }

  return true;
};

module.exports = handleDeleteStackCommand;
