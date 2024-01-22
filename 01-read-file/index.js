const path = require('path');
// const colors = require('../modules/colors');
// console.log(path.dirname(__filename));
const pathToFile = path.join(__dirname, 'text.txt');
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const fs = require('fs');
const stream = fs.createReadStream(`${pathToFile}`, 'utf-8');

let data = '';

stream.on('data', (chunk) => (data += chunk));
stream.on('end', () => console.log(colors.cyan, data, colors.white));
stream.on('error', (error) =>
  console.log(colors.red, 'Error', error.message, colors.white),
);
