import fs from 'fs';
import chalk from 'chalk';
// import deleteStack from '../helpers/deleteStack';
import { deleteStack } from '../helpers/util';

import { STACK_LIST, STACK_MAP, BASE_PATH } from '../config';

const handleDeleteStackList = (stackList, logger, isShowStackList) => {
  console.log('stackList --->', stackList);
  const existsStackList = fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => stack !== 'common' && stack !== 'mobile')
    .map(stack => (stack === 'client' ? 'react' : STACK_LIST[stack]));

  const _existsStackList = fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => stack !== 'common' && stack !== 'mobile')
    .map(stack => (stack === 'client' ? 'react' : STACK_MAP[stack]));

  console.log('_existsStackList --->', _existsStackList);

  if (isShowStackList) {
    logger.info(chalk.yellow(`List exists stack of technology: ${existsStackList.join(', ')}`));
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
      logger.error(chalk.red(`The stack of technology ${stack} not exists.`));
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

  for (let stack in STACK_LIST) {
    const stackName = STACK_LIST[stack].includes('react') ? 'react' : STACK_LIST[stack];
    if (stackList.includes(stackName)) {
      unusedStack = [
        ...unusedStack,
        ...(stack === 'client' ? ['client', 'client-react', 'client-react-native', 'mobile'] : [stack])
      ];
    }
  }

  deleteStack(unusedStack);
};

module.exports = handleDeleteStackList;
