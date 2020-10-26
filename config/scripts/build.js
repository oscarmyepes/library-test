/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const exec = promisify(childProcess.exec);

function log(type, message) {
  // eslint-disable-next-line no-console
  console[type](message);
}

async function getAllComponentsParentFolder() {
  const folders = await fs.promises.readdir('./src/components');
  return folders;
}

async function writePackageJsonFile(folder) {
  try {
    const COMPONENT_PATH = `build/${folder}`;
    const packageJson = {
      main: `./index.js`,
      module: `./index.esm.js`,
      style: `./index.css`,
      typings: `../typings/components/${folder}/index.d.ts`,
    };
    const packageJsonPath = path.join(`./${COMPONENT_PATH}`, 'package.json');

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

async function run() {
  try {
    log('info', `Packaging library`);
    await exec('yarn rollup -c ./config/rollup/rollup.config.js');
    log('info', `Packaging library finished`);
    const components = await getAllComponentsParentFolder();
    components.forEach(async (folder) => {
      await executeRollUpScript(folder);
      await writePackageJsonFile(folder);
    });
  } catch (error) {
    log('error', error);
  }
}

run();
