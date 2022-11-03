const { name, version } = require('../package.json');

module.exports = program => {
    program.version(`${name} ${version}`, '-v, --version').name('lin').usage('<command> [options]');
};
