# node-autodoc

[![Coverage Status](https://coveralls.io/repos/github/Haixiang6123/node-autodoc/badge.svg?branch=main)](https://coveralls.io/github/Haixiang6123/node-autodoc?branch=main)
[![Build Status](https://www.travis-ci.com/Haixiang6123/node-autodoc.svg?branch=main)](https://www.travis-ci.com/Haixiang6123/node-autodoc)

A test-driven generator for API documentation. Inspired by [autodoc](https://github.com/r7kamura/autodoc) and [supertest](https://www.npmjs.com/package/supertest).

## Why need this

Some people are not happy to maintain the API documentation when dealing with the large project.
Then, it causes so many confusions and problems when someone new to use previous APIs.

This library is to generate a documentation by given the test cases.
It renders the API documentation according to the input and output of each http request.

## Work flow

![](./screenshot/flow.png)

## How to use

Let's say we have an express web app:

```js
// app.js
const app = express();

app.get('/users', (req, res) => {
  res.send({ msg: 'get success', code: 0 });
});

app.post('/users', (req, res) => {
  res.json({ msg: 'post success', code: 0 });
});

app.get('/books', (req, res) => {
  res.send({ msg: 'get success', code: 0 });
});

app.post('/books', (req, res) => {
  res.json({ msg: 'post success', code: 0 });
});
```

Then, prepare your http request agent, just like how the "supertest" package does:

```js
// constants.js
import AutoDocAgent from 'node-autodoc';

// API documentation output dir 
const outputDir = path.join(__dirname, './templates');
// ejs templates dir
const templateDir = path.join(__dirname, './autodoc');

// Make a smart agent just like how the "supertest" package does
const usersAgent = new AutoDocAgent(app, {
  outputFilename: 'users.html',
  title: 'Users API Documentation',
  description: 'A small and simple documentation for how to deal with /users api',
  outputDir,
  templateDir,
});
```

Then, write a simple test case to test your API and generate an API documentation page:

```js
// users.test.js
describe('test /users API', () => {
  // A simple test case
  it('should get all the users', (done) => {
    usersAgent
      .get('/users?a=1&b=2', { title: 'Get all users', description: 'Send a get request to get all users from the server' })
      .end((err) => {
        // Some assertion here...
        done();
      });
  });

  // Render curent documenation page to the given 'outputDir'
  afterAll(() => booksAgent.renderPage());
})
```

The API doc page would be like this:

![](screenshot/users.png)

In the end, call the `AutoDocAgent.renderIndex()` in the `teardown.js` file to render the home page.

```js
// teardown.js
import AutoDocAgent from 'node-autodoc';
import {
  outputDir, templateDir, usersAgent, booksAgent,
} from './utils/constants';

const agents = [booksAgent, usersAgent];

module.exports = async () => {
  AutoDocAgent.renderIndex({
    title: 'My API Documentation',
    description: 'This is my first documentation for testing, haha~',
    author: 'Haixiang',
    agents,
    outputDir,
    templateDir,
  });
};
```

The home page would be like this:

![](screenshot/home.png)

## Example

There is also an example inside the repo. Check this folder [/example](https://github.com/Haixiang6123/node-autodoc/tree/main/example) out.

Here's the example structure:

```
├── app.js          // express web app
├── autodoc         // documenation output directory
├── bin             // start entry
├── jest.config.js  // config, add the setup.js and tearndown.js to here
├── public
├── routes          // all your apis
│   ├── books.js
│   ├── index.js
│   └── users.js
├── test
│   ├── setup.js    // clear the /autodoc directory first
│   ├── unit        // unit test cases, each one will render an api doc page
│   ├── utils       // some useful constants here
│   └── teardown.js // render home page
└── yarn.lock
```

## API

Most of the usages are same as [supertest](https://www.npmjs.com/package/supertest). Its APIs are really neat and simple.

The extra APIs this library enhances are below.

### AutoDocAgent

```js
const agent = new AutoDocAgent(
  app,
  {
    outputFilename: 'users.html',
    title: 'Users API Documentation',
    description: 'A small and simple documentation for how to deal with /users api',
    outputDir,
    templateDir,
  }
)
```

#### AutoDocAgent

| parameter | value |
|---|---|
| app | Your express app, or koa app |
| options | Extends from supertest options |


#### options

| parameter | description |
|---|---|
| outputFilename | The file name of current api document |
| outputDir | Current api document output directory |
| templateDir | Ejs template directory. It will use the [default template](https://github.com/Haixiang6123/node-autodoc/tree/main/lib/templates) if ignore it |
| title | Title of current api doc |
| description | Description of current api doc |

### AutoDocAgent.clear

Clear the given `outputDir` directory.

```js
AutoDocAgent.clear(outputDir)
```

### AutoDocAgent.renderIndex

Render the home page by given all agents.

```js
AutoDocAgent.renderIndex({
  title: 'My API Documentation',
  description: 'This is my first documentation for testing, haha~',
  author: 'Haixiang',
  agents,
  outputDir,
  templateDir,
});
```

| parameter | value |
|---|---|
| title | Home page title |
| description | Home page description |
| author | Author |
| agents | AutoDocAgent instance array |
| outputDir | Output directory |
| templateDir | Ejs template directory. It will use the [default template](https://github.com/Haixiang6123/node-autodoc/tree/main/lib/templates) if ignore it |

### renderPage

Render current API doc. No parameters.

```js
agent.renderPage()
```
