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
const handleDeleteStackList = (stackList, logger, isShowStackList) => {
  // getting a list of existing technologies
  const existsStackList = fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => Object.keys(STACK_MAP).includes(stack))
    .map(stack => STACK_MAP[stack].name);

  // check for the availability of a flag if there is,
  // show a list of technologies
  if (isShowStackList) {
    logger.info(chalk.yellow(`List exists stack of technology: ${existsStackList.join(', ')}`));
    return;
  }

  // formatting a list of tecnologies
  const formatStackList = stackList.map(stack => stack.toLowerCase());
  checkStackList(formatStackList, existsStackList, logger);
};

/**
 * Checking the list of technologies selected by user
 *
 * @param {Array} stackList - The technology list selected by user
 * @param {Array} existsStackList - The list of existing technologies
 * @param {Function} logger - The Logger
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

  deleteStackList(stackList);
};

/**
 * Delete unselected technologies
 *
 * @param {Array} stackList - The technology list selected by user
 */
const deleteStackList = stackList => {
  let unusedStack = [];

  // creating list of unused technologies
  for (let stack in STACK_MAP) {
    if (stackList.includes(STACK_MAP[stack].name)) {
      unusedStack = [...unusedStack, ...STACK_MAP[stack].subdirs];
    }
  }

  deleteStack(unusedStack);
};

module.exports = handleDeleteStackList;
