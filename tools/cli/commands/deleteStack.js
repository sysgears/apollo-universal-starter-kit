import fs from 'fs';
import chalk from 'chalk';
import { deleteStack } from '../helpers/util';

import { STACK_MAP, BASE_PATH } from '../config';

/**
 * Handler delete stack of technologies command
 *
 * @param {Array} stackList - The list of technologies
 * @param {Function} logger - The Logger
 * @param {Boolean} isShowStackList - The flag to show list of existing technologies
 */
const handlerDeleteStackCommand = (stackList, logger, isShowStackList) => {
  if (isShowStackList) {
    displayStackList(logger);
  } else {
    deleteStackList(stackList.map(stack => stack.toLowerCase()), logger);
  }
};

/**
 * Show the list of technologies
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

  const checkedStackList = getCheckedStackList(stackList, logger);

  if (!checkedStackList) return;

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
 * @param {Function} logger - The Logger
 * @returns {Array | null} - The checked list of technology
 */
const getCheckedStackList = (stackList, logger) => {
  // getting a list of existing technologies
  const existsStackList = getExistsStackList();

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
    return null;
  }

  return stackList;
};

module.exports = handlerDeleteStackCommand;
