# Sunhammer

`{{LIBRARY_NAME}}` is a library of [React](https://reactjs.org/) components that helps you build e-commerce sites faster and easier.

We have **Basic** components which can be used with any API and **Wrapper** components that uses our `{{LIBRARY_NAME}}` backend API.

## Installation

`{{LIBRARY_NAME}}` is available as an [npm package](https://www.npmjs.com/package/{{LIBRARY_NAME}}).

```
// with npm
npm i {{LIBRARY_NAME}}

// with yarn
yarn add {{LIBRARY_NAME}}
```

Please note that react >= 17.0.1 and react-dom >= 17.0.1 are peer dependencies. So you need to install those libraries as well.

- If you are using a bundler like [webpack](https://webpack.js.org/) you can install react in this way:

```
// with npm
npm i react react-dom

// with yarn
yarn add react react-dom
```

You can also use the react [CDN](https://reactjs.org/docs/add-react-to-a-website.html#tip-minify-javascript-for-production) to add react to your application if you are not using a bundler:

```
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

## Usage

## ESM modules

As early as possible in your application, require and configure your `API_KEY`:

```
import { config } from 'sunhammer-ui';
config({APY_KEY: "Your api key"})
```

Then you can import components and styles:

```
// Import components using absolute path
import { FitmentSelector, ListWrapper } from 'sunhammer-ui';
// Using relative path per component
import FitmentSelector from 'sunhammer-ui/build/FitmentSelector';

// Import all styles
import 'sunhammer-ui/build/index.css';
// Import styles per component
import 'sunhammer-ui/build/FitmentSelector/index.css';
```

### Usage with basic components (ESM modules)

When you use our basic components you are responsible to pass the data you want to show.

```
import React from 'react';
import ReactDOM from 'react-dom';
import FitmentSelector from '{{LIBRARY_NAME}}/build/FitmentSelector';\n
function App() {
  return (
    <FitmentSelector
        clearButtonText="Reset"
        labels={[
          { id: 1, name: 'Year' },
          { id: 2, name: 'Make' },
          { id: 3, name: 'Model' },
        ]}
        labelsData={{
          Make: [
            { id: 1, name: 'Make 1' },
            { id: 2, name: 'Make 2' },
            { id: 3, name: 'Make 3' },
          ],
          Model: [
            { id: 1, name: 'Model 1' },
            { id: 2, name: 'Model 2' },
            { id: 3, name: 'Model 3' },
          ],
          Year: [
            { id: 1, name: 2020 },
            { id: 2, name: 2019 },
            { id: 3, name: 2018 },
          ],
        }}
        orientation="horizontal"
        searchButtonText="Search"
        selectedValues={{
          Year: '1',
        }}
    />);
}\n
ReactDOM.render(<App />, document.querySelector('#app'));
```

### Usage with our wrapper components (ESM modules)

When you use our wrapper components you just have to put our component in your JSX and we do all the work to fetch and show data.
You can customize these components passing some props and/or overriding css classes.

```
import React from 'react';
import ReactDOM from 'react-dom';
import FitmentSelectorWrapper from '{{LIBRARY_NAME}}/build/FitmentSelectorWrapper';

function App() {
  return (
    <FitmentSelectorWrapper styled orientation="vertical" />);
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

## CDN

You can add `{{LIBRARY_NAME}}` as a `<script>` tags:

_Note: Set the [VERSION] number you want to use_

```
<!-- All components and all styles -->
<script crossorigin src="https://unpkg.com/{{LIBRARY_NAME}}@[VERSION]/build/index.umd.js" />
<link href="https://unpkg.com/{{LIBRARY_NAME}}@[VERSION]/build/index.css" rel="stylesheet" type="text/css" />
<!--  Add a specific component -->
<script crossorigin src="https://unpkg.com/{{LIBRARY_NAME}}@[VERSION]/build/[COMPONENT]/index.umd.js" />
<link href="https://unpkg.com/{{LIBRARY_NAME}}@[VERSION]/build/[COMPONENT]/index.css" rel="stylesheet" type="text/css" />
```

As early as possible in your application, require and configure your `API_KEY`:

```
window.Sunhammer.config({ API_KEY: 'YOUR_API_KEY' });
```

### Usage with basic components (UMD module)

Add a div with the id you want to use as container for your component, in this exmaple is `#fitment-selector-basic`.

```
const fitmentSelectorBasicContainer = document.querySelector('#fitment-selector-basic');
const FitmentSelectorBasic = window.Sunhammer.FitmentSelector;
ReactDOM.render(
  React.createElement(FitmentSelectorBasic, {
    styled: true,
    clearButtonText: 'Reset',
    labels: [
      { id: 1, name: 'Year' },
      { id: 2, name: 'Make' },
      { id: 3, name: 'Model' },
    ],
    labelsData: {
      Make: [
        { id: 1, name: 'Make 1' },
        { id: 2, name: 'Make 2' },
        { id: 3, name: 'Make 3' },
      ],
      Model: [
        { id: 1, name: 'Model 1' },
        { id: 2, name: 'Model 2' },
        { id: 3, name: 'Model 3' },
      ],
      Year: [
        { id: 1, name: 2020 },
        { id: 2, name: 2019 },
        { id: 3, name: 2018 },
      ],
    },
    orientation: 'horizontal',
    searchButtonText: 'Search',
    selectedValues: {
      Year: '1',
    },
  }),
  fitmentSelectorBasicContainer
);
```

### Usage with our wrapper components (UMD module)

Add a div with the id you want to use as container for your component, in this exmaple is `#fitment-selector`.

```
const fitmentSelectorContainer = document.querySelector('#fitment-selector');
const FitmentSelectorWrapper = window.Sunhammer.FitmentSelectorWrapper;
ReactDOM.render(
  React.createElement(FitmentSelectorWrapper, { styled: true }),
  fitmentSelectorContainer
);
```

## Examples

Are you looking for an example project to get started? Check out our [StoryBook]({{STORY_BOOK_URL}}) documentation.

## List of components

{{COMPONENT_LIST}}
