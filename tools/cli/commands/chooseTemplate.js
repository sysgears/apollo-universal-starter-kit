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
  const choices = existingStackList.reduce((acc, curr) => [...acc, { name: STACK_MAP[curr].title }], []);

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

  let stackDirectoryList = [];

  // creating list of unused technologies
  for (let stack in STACK_MAP) {
    if (!stackList.includes(STACK_MAP[stack].title)) {
      stackDirectoryList = [...stackDirectoryList, ...STACK_MAP[stack].subdirs];
    }
  }

  deleteStackDir(stackDirectoryList);
};

module.exports = chooseTemplate;
