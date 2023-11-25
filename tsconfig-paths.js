const { register } = require('tsconfig-paths');

const baseUrl = './dist';
const { paths } = require('./tsconfig.json').compilerOptions;
register({
  baseUrl,
  paths,
});
