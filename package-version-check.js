const execSync = require('child_process').execSync;
const package = require('./package.json');

const { version } = package;

// Look if there's already a tag with the version specified in package.json
// Need to run git fetch --unshallow --tags before executing "git tag -l" as git doesn't have the tags list fetched from origin by default on github actions
// see: https://github.com/actions/checkout/issues/206
const buffer = execSync(`git fetch --unshallow --tags && git tag -l ${version} && git tag -l v${version}`);
const res = buffer.toString();

// If no tag/release exists, exit with no error
if (!res) process.exit();

// If a tag already exists, exit with an error
console.error(`Version ${version} already exists, please bump the version in package.json`);
process.exit(1);
