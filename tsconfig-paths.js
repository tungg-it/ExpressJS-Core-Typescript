const { register } = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

const baseUrl = './dist';
const { paths } = require('./tsconfig.json').compilerOptions;
register({
  baseUrl,
  paths,
});
