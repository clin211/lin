#!/usr/bin/env node

const program = require('commander');
const { chalk, semver, logger } = require('@clin211/cli-utils');
const pkgs = require('../package.json');
const crn = require('../lib/create-react-native');

const { name, version, engines } = pkgs;

// 检查项目所支持的node版本
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

program.version(`${name} ${version}`).usage('<command> [options]');

program
    .command('crn <app-name>')
    .description('quickly create a react-native project template')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        if (!name) {
            throw new Error(logger.error(`missing required argument 'app-name'`));
        }
        crn(name, options);
    });

program.parse(process.argv);
