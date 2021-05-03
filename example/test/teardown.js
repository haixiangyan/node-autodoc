import AutoDocAgent from '../../dist';
import {
  outputDir, usersAgent, booksAgent,
} from './utils/constants';

const agents = [booksAgent, usersAgent];

module.exports = async () => {
  AutoDocAgent.renderIndex({
    title: 'My API Documentation',
    description: 'This is my first documentation for testing, haha~',
    author: 'Haixiang',
    agents,
    outputDir,
  });
};
