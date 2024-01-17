const fsProm = require('fs/promises');
const path = require('path');
const fs = require('fs');
const colors = require('../modules/colors');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');

async function deleteFile(src) {
  try {
    await fsProm.access(src, fs.F_OK);
    // console.log("File found");
    await fsProm.rm(src, { recursive: true });
  } catch (err) {
    // console.log("File not found");
  }
}

async function appendFile(error, data, dest = pathToBundle) {
  if (error) throw error;
  fs.appendFile(dest, `${data}`, (err) => {
    if (err) throw err;
    console.log(colors.cyan, 'File bundle.css was modified', colors.white);
  });
}

async function mergeStyles(src, dest) {
  try {
    fs.open(dest, 'w', (err) => {
      if (err) throw err;
      console.log(colors.green, 'File bundle.css created', colors.white);
    });

    const sourceFiles = await fsProm.readdir(src, {
      withFileTypes: true,
    });
    for (const file of sourceFiles) {
      let fileObj = path.parse(path.join(src, `${file.name}`));
      // console.log(fileObj);

      if (!file.isDirectory() && fileObj.ext === '.css') {
        // console.log(`${fileObj.name} - ${fileObj.ext.slice(1)} - ${fileObj.root}`);
        console.log(colors.cyan, file, colors.white);

        fs.readFile(path.join(src, `${file.name}`), 'utf8', appendFile);

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

(async () => {
  await deleteFile(pathToBundle);
  await mergeStyles(pathToStyles, pathToBundle);
})();
