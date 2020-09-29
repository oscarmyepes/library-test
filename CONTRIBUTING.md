# Contributing

## Project setup
1. Fork and clone the repo

2. To Install dependencies run:
```
yarn
```

## Development
1. If you want to create a new component, please follow the next steps:

- Create a new folder inside `/src` with the name of your component
- Create 4 files
    - `ComponentName.tsx` (this file will contain the component logic)
    - `ComponentName.stories.tsx` (this file will contain the logic to document the component using storybook)
    - `ComponentName.test.tsx` (File containing unit tests for the new component)
    - `index.tsx` (File to export the component)

Note: We are using `react-jss`, you can add the styles in the component folder or create a new file  `ComponentName.styles.tsx` and import it into the main component file.

2. If you want to fix a bug or do a change in an existing component, please find find the component, make the change and add proper unit tests and cases to storybook file.



3. To test your component and see how it looks in storybook run:
```
yarn storybook
```

This will run a local server in `http://localhost:6006/`
When you open that page in your browser, you should be able to see the list of components and test different scenarios changing the input props.

4. Run unit tests:
- To run all tests once use:
```
yarn test
```

- To run tests in whach mode:
```
test:watch
``` 

## Build and publish
You can generate the distribution files running:
```
yarn build
```

This will create a `/build` folder in the root at the same level of `/src` folder.

TODO instructions to publish
