import fs from 'fs';
import * as inquirer from 'inquirer';
import deleteStack from '../commands/deleteStack';
import { LIST_STACKS, BASE_PATH } from '../config';

async function chooseTemplate() {
  const stacksList = fs.readdirSync(`${BASE_PATH}/packages`).filter(stack => stack !== 'common');
  console.log('stacksList --->', stacksList);

  const choices = stacksList.reduce((prev, curr) => {
    return [...prev, { name: LIST_STACKS[curr] }];
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

  for (let stackName in LIST_STACKS) {
    if (!stack.includes(LIST_STACKS[stackName])) {
      unusedStack.push(stackName);
    }
  }

  deleteStack(unusedStack);
}

module.exports = chooseTemplate;
