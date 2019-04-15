import fs from 'fs';
import * as inquirer from 'inquirer';
import deleteStack from '../commands/deleteStack';
import { STACK_LIST, BASE_PATH } from '../config';

async function chooseTemplate() {
  const stackList = fs.readdirSync(`${BASE_PATH}/packages`).filter(stack => stack !== 'common');

  const choices = stackList.reduce((prev, curr) => {
    return [...prev, { name: STACK_LIST[curr] }];
  }, []);

  const questions = [
    {
      type: 'checkbox',
      message: 'Choose stack of technologies',
      name: 'stack',
      choices,
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one stack.';
        }

        return true;
      }
    }
  ];
  const { stack } = await inquirer.prompt(questions);

  const unusedStack = [];

  for (let stackName in STACK_LIST) {
    if (!stack.includes(STACK_LIST[stackName])) {
      unusedStack.push(stackName);
    }
  }

  // Add client and mobile stacks in next step
  deleteStack(unusedStack.filter(stack => stack !== 'client' && stack !== 'mobile'));
}

module.exports = chooseTemplate;
