import * as inquirer from 'inquirer';
import deleteStack from '../commands/deleteStack';
import { LIST_STACKS } from '../config';

async function chooseTemplate() {
  const questions = [
    {
      type: 'checkbox',
      message: 'Choose stack of technologies',
      name: 'stack',
      choices: [
        new inquirer.Separator(' ------- FrontEnd ------- '),
        { name: 'react', checked: true },
        { name: 'react native' },
        { name: 'angular' },
        { name: 'vue' },
        new inquirer.Separator(' ------- BackEnd ------- '),
        { name: 'node' },
        { name: 'scala' }
      ],
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
    if (!stack.includes(stackName)) {
      unusedStack.push(LIST_STACKS[stackName]);
    }
  }

  deleteStack(unusedStack);
}

module.exports = chooseTemplate;
