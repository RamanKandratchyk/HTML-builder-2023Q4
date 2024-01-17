const fsProm = require('fs/promises');
const path = require('path');
const fs = require('fs');
const colors = require('../modules/colors');
const pathToProject = path.join(__dirname, 'project-dist');

async function deleteDir(src) {
  try {
    await fsProm.access(src, fs.F_OK);
    // console.log("Dir found");
    await fsProm.rm(src, { recursive: true });
  } catch (err) {
    // console.log(err);
    // console.log("Dir not found");
  }
}

async function buildPage() {
  let templateStr;

  try {
    await fsProm.mkdir(pathToProject, { recursive: true });

    fs.open(path.join(pathToProject, 'index.html'), 'w', (err) => {
      if (err) throw err;
      console.log(colors.green, 'File index.html created', colors.white);
    });

    fs.open(path.join(pathToProject, 'style.css'), 'w', (err) => {
      if (err) throw err;
      console.log(colors.green, 'File style.css created', colors.white);
    });
  } catch (err) {
    console.error(err);
  }

  try {
    fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf8',
      function (error, data) {
        if (error) throw error;
        templateStr = data;
      },
    );
  } catch (err) {
    console.error(err);
  }

  try {
    const componentsFiles = await fsProm.readdir(
      path.join(__dirname, 'components'),
      { withFileTypes: true },
    );
    for (const file of componentsFiles) {
      let fileObj = path.parse(
        path.join(__dirname, 'components', `${file.name}`),
      );

      if (!file.isDirectory() && fileObj.ext === '.html') {
        // console.log(fileObj.name);

        fs.readFile(
          path.join(__dirname, 'components', `${file.name}`),
          'utf8',
          function (error, data) {
            if (error) throw error;

            let regStr = '{{' + fileObj.name + '}}';
            let reg = new RegExp(regStr, 'g');
            templateStr = templateStr.replace(reg, data);

            if (templateStr.search(/{{|}}/g) === -1) {
              fs.appendFile(
                path.join(__dirname, 'project-dist', 'index.html'),
                `${templateStr}`,
                (err) => {
                  if (err) throw err;
                  console.log('File index.html was modified');
                  // console.log(err);
                },
              );
            }

            console.log('templateStr was modified');
            console.log('****************************************************');
          },
        );
      }
    }
  } catch (err) {
    console.error(err);
  }

  try {
    const sourceFiles = await fsProm.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });
    for (const file of sourceFiles) {
      let fileObj = path.parse(path.join(__dirname, 'styles', `${file.name}`));
      // console.log(fileObj);

      if (!file.isDirectory() && fileObj.ext === '.css') {
        console.log(file);

        fs.readFile(
          path.join(__dirname, 'styles', `${file.name}`),
          'utf8',
          function (error, data) {
            if (error) throw error;
            fs.appendFile(
              path.join(__dirname, 'project-dist', 'style.css'),
              `${data}`,
              (err) => {
                if (err) throw err;
                console.log('File style.css was modified');
              },
            );
          },
        );

        console.log('******************************************');
      }
    }
  } catch (err) {
    console.error(err);
  }

  async function copyDir(src, dest) {
    const entries = await fsProm.readdir(src, { withFileTypes: true });
    await fsProm.mkdir(dest, { recursive: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fsProm.copyFile(srcPath, destPath);
      }
    }
    console.log(`Directory "${src}" was successfully copied`);
  }

  copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
  );
}

(async () => {
  await deleteDir(pathToProject);
  // await mergeStyles(pathToStyles, pathToBundle);
  buildPage();
})();
