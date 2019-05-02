import fs from 'fs';
import chalk from 'chalk';
import { deleteStack } from '../helpers/util';

import { STACK_MAP, BASE_PATH } from '../config';

const handleDeleteStackList = (stackList, logger, isShowStackList) => {
  const existsStackList = fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => Object.keys(STACK_MAP).includes(stack))
    .map(stack => STACK_MAP[stack].name);

  if (isShowStackList) {
    logger.info(chalk.yellow(`List exists stack of technology: ${existsStackList.join(', ')}`));
    return;
  }

  const formatStackList = stackList.map(stack => stack.toLowerCase());
  checkStackList(formatStackList, existsStackList, logger);
};

const checkStackList = (stackList, existsStackList, logger) => {
  const notExistsStackList = stackList
    .reduce((prev, curr) => {
      return existsStackList.includes(curr) ? [...prev] : [...prev, curr];
    }, [])
    .map(stack => {
      logger.error(chalk.red(`The stack of technology "${stack}" not exists.`));
      return stack;
    });

  if (notExistsStackList.length) {
    logger.error(chalk.yellow(`Please enter correct stack of technology`));
    return;
  }

  deleteStackList(stackList);
};

const deleteStackList = stackList => {
  let unusedStack = [];

  for (let stack in STACK_MAP) {
    if (stackList.includes(STACK_MAP[stack].name)) {
      unusedStack = [...unusedStack, ...STACK_MAP[stack].subdirs];
    }
  }

  deleteStack(unusedStack);
};

module.exports = handleDeleteStackList;
