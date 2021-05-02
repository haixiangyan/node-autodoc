import AutoDocAgent from '../lib'
import {outputDir, templateDir, usersAgent, booksAgent} from './constants'

const agents = [booksAgent, usersAgent]

module.exports = async () => {
  AutoDocAgent.renderIndex({
    agents,
    outputDir,
    templateDir
  })
}
