import AutoDocAgent from '../lib';
import { outputDir } from './utils/constants';

module.exports = async () => {
  AutoDocAgent.clear(outputDir);
};
