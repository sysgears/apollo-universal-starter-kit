import facebook from './facebook';
import github from './github';
import google from './google';
import password from './password';
import linkedin from './linkedIn';
// import serial from './serial';

import Feature from './connector';

export default new Feature(facebook, github, google, linkedin, password);
