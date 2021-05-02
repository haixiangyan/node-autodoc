import { ejsTemplateDir, outputHtmlDir } from '../lib/constants';
import AutoDocAgent from '../lib';
import app from './app';

export const templateDir = ejsTemplateDir;
export const outputDir = outputHtmlDir;

export const usersAgent = new AutoDocAgent(app, {
  outputFilename: 'users.html',
  title: 'Users API Documentation',
  description: 'A small and simple documentation for how to deal with /users api',
  outputDir,
  templateDir,
});

export const booksAgent = new AutoDocAgent(app, {
  outputFilename: 'books.html',
  title: 'books API Documentation',
  description: 'A small and simple documentation for how to deal with /books api',
  outputDir,
  templateDir,
});
