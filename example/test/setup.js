import AutoDocAgent from 'node-autodoc';
import { outputDir } from './utils/constants';

module.exports = async () => {
  AutoDocAgent.clear(outputDir);
};
