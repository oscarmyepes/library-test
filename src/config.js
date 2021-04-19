/*
  StoryBook only reads environment variables if they have the prefix STORYBOOK_.
  For that reason we use the OR notation to deploy StoryBook or build the components.
  When there is no .env file, like in AWS to deploy the site we must use STORYBOOK_ vars
*/

const env = {
  API_URL: process.env.API_URL || process.env.STORYBOOK_API_URL,
  LIBRARY_NAME: process.env.LIBRARY_NAME || process.env.STORYBOOK_LIBRARY_NAME,
  STORY_BOOK_URL:
    process.env.STORY_BOOK_URL || process.env.STORYBOOK_STORY_BOOK_URL,
};

const apiKeyEnv = process.env.API_KEY || process.env.STORYBOOK_API_KEY;

const _window = typeof window === 'object' ? window : {};
_window.sunhammer = _window.sunhammer || {};
_window.sunhammer.config = {
  API_KEY: process.env.API_KEY || process.env.STORYBOOK_API_KEY,
};

function config({ API_KEY }) {
  _window.sunhammer.config.API_KEY = API_KEY || apiKeyEnv;
}

function getConfig() {
  return _window.sunhammer.config;
}

module.exports.env = env;
/*
  This configuration in imported in ./index.ts (our main file which exports all components as a library)
  So devs can configure the API_KEY int his way:

  import { config } from 'sunhammer-ui';
  config({APY_KEY: "Your api key"})
  
*/
module.exports.config = config;

module.exports.getConfig = getConfig;
