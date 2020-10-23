const childProcess = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');

const exec = promisify(childProcess.exec);

function log(type, message) {
  console[type](message);
}

async function getAllComponentsParentFolder() {
  const folders = await fs.promises.readdir('./src/components');
  return folders;
}

async function writePackageJsonFile(folder) {
  try {
    const COMPONENTS_PATH = `build/${folder}`;
    const packageJson = {
      main: `./index.js`,
      module: `./index.esm.js`,
      typings: `./index.d.ts`,
      style: `./index.css`,
    };
    const packageJsonPath = path.join(`./${COMPONENTS_PATH}`, 'package.json');

    log('info', `Writting package.json for ${folder}`);
    await fs.promises.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  } catch (error) {
    log('error', error);
  }
}

async function executeRollUpScript(component) {
  log('info', `Building ${component}`);
  await exec(
    `yarn rollup -c ./config/rollup/rollup.component.config.js -i ./src/components/${component}/index.tsx`
  );
  log('info', `${component} built`);
}

async function copyTsDeclarations(folder) {
  const SOURCE = `./build/components/${folder}`;
  const DEST = `./build/${folder}`;
  log('info', `Copying declarations for ${folder}`);
  fsExtra.copy(SOURCE, DEST, function (err) {
    if (err) {
      return log('error', 'An error occured while copying the folder.');
    }
    log('info', 'Copy declarations completed');
  });
}

async function run() {
  try {
    log('info', `Packaging library`);
    await exec('yarn rollup -c ./config/rollup/rollup.config.js');
    log('info', `Packaging library finished`);
    const components = await getAllComponentsParentFolder();
    components.forEach(async (folder) => {
      await executeRollUpScript(folder);
      await writePackageJsonFile(folder);
      await copyTsDeclarations(folder);
    });
  } catch (error) {
    log('error', error);
  }
}

run();
