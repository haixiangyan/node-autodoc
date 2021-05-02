import AutoDocAgent from "../lib";
import {ejsTemplateDir, outputHtmlDir} from "../lib/constants";

module.exports = async () => {
  AutoDocAgent.config({
    outputDir: outputHtmlDir,
    templateDir: ejsTemplateDir,
  })
}
