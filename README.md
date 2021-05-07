# node-autodoc

[![Coverage Status](https://coveralls.io/repos/github/Haixiang6123/node-autodoc/badge.svg?branch=main)](https://coveralls.io/github/Haixiang6123/node-autodoc?branch=main)
[![Build Status](https://www.travis-ci.com/Haixiang6123/node-autodoc.svg?branch=main)](https://www.travis-ci.com/Haixiang6123/node-autodoc)

[简体中文](./README-CN.md)

An API documentation generator driven by unit testing. Inspired by [autodoc](https://github.com/r7kamura/autodoc) and [supertest](https://www.npmjs.com/package/supertest).

## Why need this

Some people are not happy to maintain the API documentation when dealing with the large project.
Then, it causes so many confusions and problems when someone new to use previous APIs.

This library is to generate a documentation by given the test cases.
It renders the API documentation according to the input and output of each http request.

## Work flow

![](./screenshot/flow.png)

## Example

There is also an example inside the repo. Check [this](https://github.com/Haixiang6123/node-autodoc/tree/main/example) out!

## Render mode

### Default template

It renders the documentation using ejs template engine by default.

### Custom template

If you have better templates, you can specify the `templateDir` to let AutoDoc render your templates. 
You may want to check out [the default templates](https://github.com/Haixiang6123/node-autodoc/tree/main/lib/templates) first, then design your templates.

### Custom render function

**If you have better idea to render the API doc page, you can also pass a callback in `renderPage` to make your custom renders.**

```js
agent.renderPage((currentAgent) => {
  // Assemable your render data
  const myRenderData = {
    title: currentAgent.title,
    description: currentAgent.description,
    docMetaCollection: currentAgent.docMetaCollection,
    tableOfContent: currentAgent.docMetaCollection.map((docMeta) => ({
      link: `#${encodeURIComponent(docMeta.title)}`,
      title: docMeta.title,
    })),
  };
  
  // Your render function
  customRender(myRenderData);
})
```

**A very common case would be like: Send all the `docMetaCollection` to your documentation server and generate your own documentation website.**

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

### restful method

When calling the restful method, it's calling the restful method of supertest. 
The only difference is that you can pass the second parameter to render title and description.

```js
agent.get('/users', {
  title: 'Fetch all users',
  description: 'To get all user infomation'
})
```

### renderPage

Render current API doc.

```js
agent.renderPage()
```

**If you have better idea to render the API doc page, you can also put a callback in there to make your custom renders.**

```js
agent.renderPage((currentAgent) => {
  // Assemable your render data
  const myRenderData = {
    title: currentAgent.title,
    description: currentAgent.description,
    docMetaCollection: currentAgent.docMetaCollection,
    tableOfContent: currentAgent.docMetaCollection.map((docMeta) => ({
      link: `#${encodeURIComponent(docMeta.title)}`,
      title: docMeta.title,
    })),
  };
  
  // Your render function
  customRender(myRenderData);
})
```
