import path from 'path';
import AutoDocAgent from 'node-autodoc';
import app from '../../app';

export const outputDir = path.resolve(__dirname, '../../autodoc');

export const usersAgent = new AutoDocAgent(app, {
  outputFilename: 'users.html',
  title: 'Users API Documentation',
  description: 'A small and simple documentation for how to deal with /users api',
  outputDir,
});

export const booksAgent = new AutoDocAgent(app, {
  outputFilename: 'books.html',
  title: 'books API Documentation',
  description: 'A small and simple documentation for how to deal with /books api',
  outputDir,
});
