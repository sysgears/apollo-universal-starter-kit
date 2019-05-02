import fs from 'fs';
import * as inquirer from 'inquirer';
// import deleteStack from '../helpers/deleteStack';
import { deleteStack } from '../helpers/util';
import { STACK_MAP, BASE_PATH } from '../config';

async function chooseTemplate() {
  const existingStackList = fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => stack !== 'common' && stack !== 'mobile');

  const choices = existingStackList.reduce((prev, curr) => {
    return [...prev, { name: STACK_MAP[curr].name }];
  }, []);

  const questions = [
    {
      type: 'checkbox',
      message: 'Choose your technology stack or stacks',
      name: 'stackList',
      choices,
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one stack.';
        }

        return true;
      }
    }
  ];
  const { stackList } = await inquirer.prompt(questions);

  let unusedStack = [];

  for (let stack in STACK_MAP) {
    if (!stackList.includes(STACK_MAP[stack].name)) {
      unusedStack = [...unusedStack, ...STACK_MAP[stack].subdirs];
    }
  }

  // Add client and mobile stacks in next step
  deleteStack(unusedStack);
}

module.exports = chooseTemplate;
