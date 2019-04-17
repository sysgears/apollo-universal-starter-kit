import fs from 'fs';
import * as inquirer from 'inquirer';
import deleteStack from '../helpers/deleteStack';
import { STACK_LIST, BASE_PATH } from '../config';

async function chooseTemplate() {
  const stackList = fs.readdirSync(`${BASE_PATH}/packages`).filter(stack => stack !== 'common' && stack !== 'mobile');

  const choices = stackList.reduce((prev, curr) => {
    return [...prev, { name: STACK_LIST[curr] }];
  }, []);

  const questions = [
    {
      type: 'checkbox',
      message: 'Choose your technology stack or stacks',
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

  let unusedStack = [];

  for (let stackName in STACK_LIST) {
    if (!stack.includes(STACK_LIST[stackName])) {
      unusedStack = [
        ...unusedStack,
        ...(stackName === 'client' ? ['client', 'client-react', 'client-react-native', 'mobile'] : [stackName])
      ];
    }
  }

  // Add client and mobile stacks in next step
  deleteStack(unusedStack);
}

module.exports = chooseTemplate;
