const fs = require('fs/promises');
const path = require('path');
// const colors = require('../modules/colors');
const pathToDir = path.join(__dirname, 'secret-folder');
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

async function readFilesInfo(pathToDir) {
  try {
    const files = await fs.readdir(pathToDir, {
      withFileTypes: true,
    });
    // console.log(files);
    for (const file of files) {
      // console.log(file.name);
      // console.log(file.isDirectory());

      let fileObj = path.parse(path.join(pathToDir, `${file.name}`));
      // console.log(fileObj);

      let statFile = await fs.stat(path.join(pathToDir, `${file.name}`));
      // console.log(statFile);
      let sizeInKb = (statFile.size / 1024).toFixed(3);

      if (!file.isDirectory()) {
        console.log(
          colors.yellow,
          `${fileObj.name} - ${fileObj.ext.slice(1)} - ${sizeInKb} Kb`,
          colors.white,
        );
        console.log(
          colors.cyan,
          '******************************************',
          colors.white,
        );
      }
    }
  } catch (err) {
    console.error(colors.red, err, colors.white);
  }
}

readFilesInfo(pathToDir);
