const { Command } = require('commander');
const { chalk, semver } = require('@clin211/cli-utils');
const pkgs = require('../package.json');
const version = require('./version');
const configCommand = require('./config');
const crn = require('./crn');
const translate = require('./translate');

const { name, engines } = pkgs;

// check the node Version
const isMatches = semver.satisfies(process.version, engines.node, {
    includePrerelease: true,
});

if (!isMatches) {
    console.log(
        chalk.red(
            `You are using Node ${process.version}, but this version of ${name} requires Node ${engines.node}.\n\nPlease upgrade your Node version!`,
        ),
    );
    process.exit(1);
}

function run() {
    const program = new Command('lin');
    // version
    version(program);

    // register the config command
    program.addCommand(configCommand());

    // create react native
    crn(program);

    // translate
    translate(program);

    program.parse(process.argv);
}

module.exports = run;
