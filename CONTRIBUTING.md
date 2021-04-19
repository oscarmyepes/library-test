# Contributing

## Project setup

1. Fork and clone the repo

2. Create a `.env` and `.env.test` file in the root directory

```
// .env
API_URL=http://api-url.com
LIBRARY_NAME=sunhammer-ui
STORY_BOOK_URL=https://develop.dq31wl4uj8x39.amplifyapp.com/
API_KEY=any-key-you-want
```

```
// .env.test
API_URL=http://test/api
API_KEY=any-key-you-want
```

Confirm with a fellow developer what variable values should be set in those files.

3. To Install dependencies run:

```
yarn
```

4. To launch the development server run:

```
yarn storybook
or
yarn dev
```

Note: If you want to use Docker you can skip points 3 and 4 and follow _Using Docker as development environment_ instructions.

## Development

1. If you want to create a new component, please follow the next steps:

- Create a new folder inside `/src/components` with the name of your component
- Create the followig structure:

```
./src/MyNewComponent
  │
  └─ ./__mocks__/ (Folder with mocked data to run unit tests)
  |   │
  |   └─ [mockFileName].ts
  |
  └─ ./models/ (Folder to create all interfaces that will be used in the new component)
  |   │
  |   └─ index.ts
  |
  └─ ./stories/ (Folder to create all stories to document each component using storybook .mdx files)
  |   │
  |   └─ [ComponentName].stories.mdx
  |   └─ NestedInterfaces.tsx (File containing dummy components to be used in ArgsTable to show nested interfaces)
  |
  └─ [ComponentName].tsx (File containing the component logic)
  └─ [ComponentName].test.tsx (File containing unit tests for the new component)
  └─ index.scss (Styles for the new component using SASS modules)
  └─ index.tsx (File to export the component)

```

Note: We are using `sass modules`, all styles must be in a `.scss` file and then you can use modules importing styles in this way:

```
// ./styles.scss
.root {
  color: #FEFEFE;
}
.button {
  background-color: #FAFAFA;
}
```

```
// ./MyNewComponent.tsx
import styles from './styles.scss';
...
<div className={styles.root}>
  <h1>This is my component</h1>
  <button className={styles.button}>Button</button>
</div>
```

2. If you want to fix a bug or change an existing component, please find the component, make the change and add proper unit tests and cases to storybook file.

3. To test your component and see how it looks in storybook run:

```
yarn storybook
```

This will start a local server in `http://localhost:6006/`.

When you open that URL in your browser, you should be able to see the list of components and test different scenarios changing the input props.

4. Run unit tests:

- To run all tests once use:

```
yarn test
```

- To run tests in watch mode:

```
yarn test:watch
```

- Debug unit tests

You can debug unit tests pressing F5 key or any shortcut you use to launch the debug mode in VSCode.

## Theming

Our default theme is defined using CSS variables.
In `./src/styles/` folder you can find files to style different components.
Styles for components in `./src/styles/` folder should be basic styles not related to layout or responsive design. In that folder we can add styles for font colors, shadows, borders, etc.

Important variables like **primary-color**, **scondary-color** should be defined in `./src/styles/_variables.scss` file, we use CSS variables to easily change the values for each variable.

Every variable must have the prefix `sui-`, for instance the variable for our primary color is defined as `--sui-primary-color`.

## Using Docker as development environment

Run:

```
docker-compose up
```

Or if you want to run it in detached mode:

```
docker-compose up -d
```

This will start a local server in `http://localhost:6006/`

2. To run commands inside the container use:

```
docker-compose run sunhammer [command]
```

> Example:

- Run tests:

```
docker-compose run sunhammer yarn test
```

- Install a new dependency

```
docker-compose run sunhammer yarn add new-depedency
```

**Imporant:** If you have issues with docker regarding `node_modules` path or something related, please delete the node_modules folder using your admin account and then try again.

## Build and publish

We have a github actiion to publish the library to NPM, we have to follow these steps:

1. Bump `pacakage.json` version with a proper version
2. Push your changes into develop branch
3. Merge develop into master
4. Create a release in github

When you create the release in github, the github action will automatically publish the new changes in NPM.

## Playground

Inside playground folder we have 2 folders:

1. `/esm`: this folder contains a **typescript-react** project to test our library. This is a normal web application where we can use npm modules.

In this project you can import `sunhammer-ui` library and test how it works in the same way other developers will use the library.

To use this **playground/esm** project and test your local changes run: `yarn playground:esm`.

This commnad will build the library and publish it locally (using [yalc](https://www.npmjs.com/package/yalc)), then will start a server in `http://localhost:8080/` where you can see how each component can be included in a normal web application.

**Note:** Every time you make a change in the library, you'll have to run `yarn playground:esm.` command to update the sunhammer-ui dependency in the playground project.

2. `/umd`: this folder contains an `index.html` and a `script.js` file to test the library using UMD modules with a `<script>` tag.
   To use this **playground/umd** project and test your local changes run: `yarn playground:umd`.
   This command will build the library and copy the `build` folder into `playground/umd`, then we can use something like:

- Include a single component:

```
<link href="build/FitmentSelector/index.css" rel="stylesheet" type="text/css" />
<script src="build/FitmentSelector/index.umd.js"></script>
```

- Include all components:

```
<link href="build/index.css" rel="stylesheet" type="text/css" />
<script src="build/index.umd.js"></script>
```
