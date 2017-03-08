const execSync = require('child_process').execSync;

if (process.env.NODE_ENV === 'production') {
  execSync('npm run clean && npm run build && npm run migrate && npm run seed', { stdio: [0, 1, 2] });
}