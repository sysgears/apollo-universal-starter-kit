import facebook from './facebook';
import github from './github';
import google from './google';
import password from './password';
import linkedin from './linkedIn';
// import serial from './serial';

import AuthModule from './AuthModule';

export default new AuthModule(facebook, github, google, linkedin, password);
