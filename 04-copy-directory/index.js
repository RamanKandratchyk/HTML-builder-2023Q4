const fsProm = require('fs/promises');
const path = require('path');
const constants = require('fs');
const colors = require('../modules/colors');
const pathToFiles = path.join(__dirname, 'files');
const pathToFilesCopy = path.join(__dirname, 'files-copy');

async function deleteDir(src) {
  try {
    await fsProm.access(src, constants.F_OK);
    // console.log("File found");
    await fsProm.rm(src, { recursive: true });
  } catch (err) {
    console.error(colors.red, err, colors.white);
  }
}

async function copyDir(src, dest) {
  try {
    await fsProm.mkdir(dest, { recursive: true });

    const sourceFiles = await fsProm.readdir(src, {
      withFileTypes: true,
    });
    for (const file of sourceFiles) {
      console.log(colors.cyan, file, colors.white);
      await fsProm.copyFile(
        path.join(src, `${file.name}`),
        path.join(dest, `${file.name}`),
      );
    }
  } catch (err) {
    console.error(colors.red, err, colors.white);
  }
}

(async () => {
  await deleteDir(pathToFilesCopy);
  await copyDir(pathToFiles, pathToFilesCopy);
})();
