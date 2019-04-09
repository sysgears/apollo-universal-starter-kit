// import shell from 'shelljs';
import { moveToModules } from '../helpers/util';

const deleteStack = result => {
  moveToModules();
  console.log('result --->', result);
};

export default deleteStack;
