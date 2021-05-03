import AutoDocAgent from '../../dist';
import { outputDir } from './utils/constants';

module.exports = async () => {
  AutoDocAgent.clear(outputDir);
};
