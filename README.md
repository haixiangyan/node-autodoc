# node-autodoc

[![Coverage Status](https://coveralls.io/repos/github/Haixiang6123/node-autodoc/badge.svg?branch=main)](https://coveralls.io/github/Haixiang6123/node-autodoc?branch=main)
[![Build Status](https://www.travis-ci.com/Haixiang6123/node-autodoc.svg?branch=main)](https://www.travis-ci.com/Haixiang6123/node-autodoc)

## What is this

A unit test driven API documentation generator.

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

You can check the example in the `test` folder.

Here's the folder structure:

```
├── setup.js // clear the output directory
├── teardown.js // render home page
├── unit
│   ├── books.test.js // the /books API test case
│   └── users.test.js // the /users API test case
└── utils
    ├── app.js // express web app
    └── constants.js // some useful constants
```
