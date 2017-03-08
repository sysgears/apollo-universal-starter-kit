const execSync = require('child_process').execSync;

execSync('npm run clean && npm run build && npm run migrate && npm run seed', {stdio:[0,1,2]});