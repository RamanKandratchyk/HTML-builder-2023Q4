const fsProm = require('fs/promises');
const path = require('path');
const fs = require('fs');
const colors = require('../modules/colors');
const pathToProject = path.join(__dirname, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');
const pathToTemplate = path.join(__dirname, 'template.html');
let templateStr = '';

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

async function createDir(src) {
  try {
    await fsProm.mkdir(src, { recursive: true });
  } catch (err) {
    console.log(colors.red, err, colors.white);
  }
}

async function createFiles(src, ...files) {
  try {
    files.forEach((file) => {
      fs.open(path.join(src, file), 'w', (err) => {
        if (err) throw err;
        console.log(colors.green, `${file} file created`, colors.white);
      });
    });
  } catch (err) {
    console.log(colors.red, err, colors.white);
  }
}

async function readFile(src, callBack) {
  try {
    fs.readFile(src, 'utf8', callBack);
  } catch (err) {
    console.error(colors.red, err, colors.white);
  }
}

async function templateReadCallBack(error, data) {
  if (error) throw error;
  templateStr = data;
}

async function fillHTMLAccordToTemplate(compSrc, dest) {
  try {
    const componentsFiles = await fsProm.readdir(compSrc, {
      withFileTypes: true,
    });
    for (const file of componentsFiles) {
      let fileObj = path.parse(path.join(compSrc, `${file.name}`));

      if (!file.isDirectory() && fileObj.ext === '.html') {
        // console.log(fileObj.name);

        await readFile(
          path.join(compSrc, `${file.name}`),
          function (error, data) {
            if (error) throw error;

            let regStr = '{{' + fileObj.name + '}}';
            let reg = new RegExp(regStr, 'g');
            templateStr = templateStr.replace(reg, data);

            if (templateStr.search(/{{|}}/g) === -1) {
              fs.appendFile(
                path.join(dest, 'index.html'),
                `${templateStr}`,
                (err) => {
                  if (err) throw err;
                  console.log(
                    colors.green,
                    'index.html file was modified',
                    colors.white,
                  );
                  // console.log(err);
                },
              );
            }

            console.log(colors.cyan, 'templateStr was modified', colors.white);
          },
        );
      }
    }
  } catch (err) {
    console.error(colors.red, err, colors.white);
  }
}

async function mergeStyles(src, dest) {
  try {
    const sourceFiles = await fsProm.readdir(src, {
      withFileTypes: true,
    });
    for (const file of sourceFiles) {
      let fileObj = path.parse(path.join(src, `${file.name}`));
      // console.log(fileObj);

      if (!file.isDirectory() && fileObj.ext === '.css') {
        console.log(colors.yellow, `${file.name} was processed`, colors.white);

        await readFile(path.join(src, `${file.name}`), function (error, data) {
          if (error) throw error;
          fs.appendFile(path.join(dest, 'style.css'), `${data}`, (err) => {
            if (err) throw err;
            console.log(
              colors.cyan,
              'style.css file was modified',
              colors.white,
            );
          });
        });

        console.log(colors.cyan, '*************************', colors.white);
      }
    }
  } catch (err) {
    console.error(colors.red, err, colors.white);
  }
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
  console.log(
    colors.green,
    'Directory',
    colors.yellow,
    `"${src}"`,
    colors.green,
    'was successfully copied',
    colors.white,
  );
}

async function buildPage() {
  await deleteDir(pathToProject);

  await createDir(pathToProject);

  await createFiles(pathToProject, 'index.html', 'style.css');

  await readFile(pathToTemplate, templateReadCallBack);

  await fillHTMLAccordToTemplate(pathToComponents, pathToProject);

  await mergeStyles(pathToStyles, pathToProject);

  await copyDir(
    path.join(__dirname, 'assets'),
    path.join(pathToProject, 'assets'),
  );
}

buildPage();
