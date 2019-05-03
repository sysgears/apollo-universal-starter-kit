import fs from 'fs';
import chalk from 'chalk';
import { deleteStack } from '../helpers/util';

import { STACK_MAP, BASE_PATH } from '../config';

/**
 * Delete a list of technologies
 *
 * @param {Array} stackList - The list of technologies
 * @param {Function} logger - The Logger
 * @param {Boolean} isShowStackList - The flag to show list of existing technologies
 */
const handlerDeleteStackCommand = (stackList, logger, isShowStackList) => {
  if (isShowStackList) {
    displayStackList(logger);
  } else {
    deleteStackList(stackList, logger);
  }
};

/**
 * check for the availability of a flag if there is,
 * show a list of technologies
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
 * @param {Function} logger - The Logger
 */
const deleteStackList = (stackList, logger) => {
  let unusedStack = [];

  // getting a list of existing technologies
  const existsStackList = getExistsStackList();

  // formatting a list of tecnologies
  const formatStackList = stackList.map(stack => stack.toLowerCase());
  const checkedStackList = checkStackList(formatStackList, existsStackList, logger);

  // creating list of unused technologies
  for (let stack in STACK_MAP) {
    if (checkedStackList.includes(STACK_MAP[stack].name)) {
      unusedStack = [...unusedStack, ...STACK_MAP[stack].subdirs];
    }
  }

  deleteStack(unusedStack);
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
 * @param {Array} existsStackList - The list of existing technologies
 * @param {Function} logger - The Logger
 * @returns {Array} - The checked list of technology
 */
const checkStackList = (stackList, existsStackList, logger) => {
  // check on the stackList in the existsStackList
  const notExistsStackList = stackList
    // create non-existent technology list
    .reduce((prev, curr) => (existsStackList.includes(curr) ? [...prev] : [...prev, curr]), [])
    .map(stack => {
      // show a log in shell for each non-existent technology
      logger.error(chalk.red(`The stack of technology "${stack}" not exists.`));
      return stack;
    });

  if (notExistsStackList.length) {
    logger.error(chalk.yellow(`Please enter correct stack of technology`));
    return;
  }

  return stackList;
};

module.exports = handlerDeleteStackCommand;
