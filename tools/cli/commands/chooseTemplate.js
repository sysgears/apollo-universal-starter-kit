import fs from 'fs';
import * as inquirer from 'inquirer';
import { deleteStackDir } from '../helpers/util';
import { STACK_MAP, BASE_PATH } from '../config';

/**
 * Generates a list of technologies for the library 'inquirer'
 * and delete a list of unused technologies
 */
const chooseTemplate = async () => {
  // getting a list of existing technologies
  const existingStackList = fs
    .readdirSync(`${BASE_PATH}/packages`)
    .filter(stack => Object.keys(STACK_MAP).includes(stack));

  // creating a list of options with existing technologies for 'inquirer'
  const choices = existingStackList.map(stack => ({
    name: STACK_MAP[stack].title
  }));

  // creating options for 'inquirer'
  const questions = [
    {
      type: 'checkbox',
      message: 'Choose your technology stack or stacks',
      name: 'stackList',
      choices,
      validate: answer => (answer.length < 1 ? 'You must choose at least one stack.' : true)
    }
  ];

  // getting a list of selected technologies using 'inquirer'
  const { stackList } = await inquirer.prompt(questions);

  // collects list of unused technologies
  const stackDirList = Object.keys(STACK_MAP).reduce(
    (acc, curr) => (stackList.includes(STACK_MAP[curr].title) ? acc : [...acc, ...STACK_MAP[curr].subdirs]),
    []
  );

  deleteStackDir(stackDirList);
};

module.exports = chooseTemplate;
