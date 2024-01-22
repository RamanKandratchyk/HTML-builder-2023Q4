const fs = require('fs');
const path = require('path');
const { stdin } = process;
// const colors = require('../modules/colors');
const pathToFile = path.join(__dirname, 'text.txt');
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

fs.open(pathToFile, 'w', (err) => {
  if (err) throw err;
  // console.log('The file text.txt has been created');
});

// stdout.write('Hello! Enter text for entry:\n');
console.log(colors.green, 'Hello! Enter text for entry:', colors.white);

stdin.on('data', (data) => {
  let dataStr = data.toString();
  // stdout.write(dataStr);
  // console.log(dataStr.length);

  if (dataStr.length === 6 && dataStr.slice(0, 4) === 'exit') {
    // stdout.write('Exit has been entered\n');
    console.log(colors.green, 'Exit has been entered', colors.white);
    process.exit();
  } else {
    fs.appendFile(pathToFile, `${data}`, (err) => {
      if (err) throw err;
      console.log(colors.cyan, 'The file has been modified', colors.white);
    });
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  // stdout.write('The process is completed. See you later.');
  console.log(
    colors.green,
    'The process is completed. See you later.',
    colors.white,
  );
});
