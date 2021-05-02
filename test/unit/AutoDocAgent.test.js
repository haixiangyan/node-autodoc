import fsExtra from 'fs-extra';
import path from 'path';
import fs from 'fs';
import AutoDocAgent from '../../lib';
import { templateDir, usersAgent } from '../utils/constants';
import app from '../utils/app';

describe('test some features of AutoDocAgent', () => {
  it('can clear the given directory', () => {
    const tempOutputDir = path.resolve(__dirname, './test');

    fsExtra.ensureDirSync(tempOutputDir);

    const files = fs.readdirSync(tempOutputDir);
    expect(files).toHaveLength(0);

    fsExtra.outputFileSync(path.resolve(tempOutputDir, 'xxx.txt'), 'hello');
    fsExtra.outputFileSync(path.resolve(tempOutputDir, 'yyy.txt'), 'world');

    const twoFileList = fs.readdirSync(tempOutputDir);
    expect(twoFileList).toHaveLength(2);

    AutoDocAgent.clear(tempOutputDir);

    const emptyFileList = fs.readdirSync(tempOutputDir);
    expect(emptyFileList).toHaveLength(0);
  });

  it('throw error when render home page without agent list', () => {
    expect(() => {
      AutoDocAgent.renderIndex({});
    }).toThrow('Agent list is empty');
  });

  it('can render the home page', () => {
    const tempOutputDir = path.resolve(__dirname, 'output');

    AutoDocAgent.renderIndex({
      title: 'My API Documentation',
      description: 'This is my first documentation for testing, haha~',
      author: 'Haixiang',
      agents: [usersAgent],
      outputDir: tempOutputDir,
      templateDir,
    });

    const files = fs.readdirSync(tempOutputDir);

    expect(files.includes('index.html')).toBeTruthy();

    AutoDocAgent.clear(tempOutputDir);
  });

  it('can deal with empty values', () => {
    const agent = new AutoDocAgent(app, {});

    expect(agent.title).toEqual('Untitled');
    expect(agent.description).toEqual('');
    expect(agent.getDocMeta('x', 'y')).toBeNull();
    expect(() => agent.renderPage()).toThrow('No output file name');
  });
});
