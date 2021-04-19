/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const exec = promisify(childProcess.exec);

async function run() {
  console.log('ENV', process.env.API_URL);
  console.log('ENV', process.env.LIBRARY_NAME);
  console.log('ENV', process.env.STORY_BOOK_URL);
  try {
    const components = await getAllComponentsParentFolder();

    log('info', 'Creating main index file');
    createMainIndexFile(components);
    log('info', 'Main index file created');

    log('info', `Packaging library`);
    await exec('yarn rollup -c ./config/rollup/rollup.config.js');
    removeNotNeededCssFiles('build');
    log('info', `Packaging library finished`);
    components.forEach(async (folder) => {
      await executeRollUpScript(folder);
      await writePackageJsonFile(folder);
      removeNotNeededCssFiles(`build/${folder}`);
    });
  } catch (error) {
    log('error', error);
  }
}

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

/*
  TODO Find a way to prevent the gneration of index.esm.css and index.umd.css files with rollup.
  I couldn't find a way to don't generate those files with rollup.
  So this function removes those files because they have the same content as index.css file.
*/
function removeNotNeededCssFiles(path) {
  ['esm', 'umd'].forEach((ext) =>
    fs.promises.unlink(`${path}/index.${ext}.css`)
  );
}

function createMainIndexFile(components) {
  const template = `
export { default as {{COMP_NAME}} } from './components/{{COMP_NAME}}';
export * from './components/{{COMP_NAME}}';`;

  const fileContent = components.map((compName) =>
    template.replace(/{{COMP_NAME}}/g, compName)
  );
  fs.writeFileSync(
    path.join(__dirname, '../../src/index.ts'),
    `/* eslint-disable import/export */
${fileContent.join('\n')}

export { config } from './config';
`
  );
}

// Exec script
run();
