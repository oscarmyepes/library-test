/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
dotenv.config(
  process.env.NODE_ENV === 'production' ? { path: '.env.prod' } : null
);
const fs = require('fs');
const path = require('path');
const { env } = require('../../src/config');

// Readme
const filePath = path.join(
  __dirname,
  '../../src/docsTemplates/Readme.template.md'
);

const readmeContent = fs.readFileSync(filePath, 'utf8');

const parsedFile = readmeContent
  .replace(/{{LIBRARY_NAME}}/g, env.LIBRARY_NAME)
  .replace(/{{COMPONENT_LIST}}/g, buildComponentList())
  .replace(/{{STORY_BOOK_URL}}/g, env.STORY_BOOK_URL);

function buildComponentList() {
  const folders = fs.readdirSync('./src/components');
  return folders.reduce(
    (acc, comp) => `${acc}
  * ${comp}
  `,
    ``
  );
}

fs.writeFileSync(path.join(__dirname, '../../README.md'), parsedFile);

// StoryBook introduction page
const sbFilePath = path.join(
  __dirname,
  '../../src/docsTemplates/IntroStoryBook.template.mdx'
);
const sbIntro = fs.readFileSync(sbFilePath, 'utf8');

const sbIntroParsed = sbIntro
  .replace(/{{LIBRARY_NAME}}/g, env.LIBRARY_NAME)
  .replace(/{{COMPONENT_LIST}}/g, buildComponentList());

fs.writeFileSync(
  path.join(__dirname, '../storybook/Introduction.stories.mdx'),
  `${sbIntroParsed}`
);
