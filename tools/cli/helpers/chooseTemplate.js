import * as inquirer from 'inquirer';
import deleteStack from '../commands/deleteStack';

async function chooseTemplate() {
  const questions = [
    {
      type: 'checkbox',
      message: 'Choose stack of technologies',
      name: 'stack',
      choices: [
        new inquirer.Separator(' ------- FrontEnd ------- '),
        { name: 'react', test: 'test' },
        { name: 'react native', test: 'test' },
        { name: 'angular', test: 'test' },
        { name: 'vue', test: 'test' },
        new inquirer.Separator(' ------- BackEnd ------- '),
        { name: 'node', test: 'test' },
        { name: 'scala', test: 'test' }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one stack.';
        }

        return true;
      }
    }
  ];
  const result = await inquirer.prompt(questions);

  deleteStack(result);
}

module.exports = chooseTemplate;
