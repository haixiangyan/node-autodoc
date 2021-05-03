# AutoDoc 样例

[English](./README.md)

## API 文档预览

点击 [此处](http://yanhaixiang.com/node-autodoc/) 来预览.

是不是很丑陋？你可以使用自定义模板和自定义函数来生成你想要的 API 文档。
[具体可见](https://github.com/Haixiang6123/node-autodoc#render-mode).

## 文件结构

下面是样例的文件结构

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

## 怎么用

比如现在我们有一个 Express 或者 KOA 的应用 app：

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

先准备你的 agent。

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

然后，写一个简单的测试用例来测试你的接口，并渲染当前 API 文档。

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

当前 API 文档就会像生成出来：

![](../screenshot/users.png)

最后，在 `teardown.js` 调用 `AutoAgent.renderIndex()` 来渲染首页。

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

首页也能一并生成：

![](../screenshot/home.png)
