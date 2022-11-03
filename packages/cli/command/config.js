const { Command } = require('commander');
const { chalk, validate, logger } = require('@clin211/cli-utils');
const { name } = require('../package.json');
const { setAuthorizationKey, getLocalConfiguration } = require('../lib/utils/utils');

function makeConfigCommand() {
    const config = new Command('config');
    config.description(`About ${name} configuration`);

    config
        .command('set')
        .description(`set ${name} configuration`)
        .option(
            '--youdao, youdao',
            `the secret key to youdao, format: ${chalk.blueBright('lin config set --youdao')}`,
        )
        .option(
            '--deepl, deepl <string>',
            `the secret key to deepl, format: ${chalk.blueBright(
                'lin config set --deep=<your secret>',
            )}`,
            validate.verifyNotNull,
        )
        .option(
            `--use, use <string>`,
            `What tools to use for translation, default use ${chalk.blueBright(
                'deepl',
            )}, format: ${chalk.blueBright('lin config set --use=<youdao or deepl>')}`,
            validate.verifyNotNull,
        )
        .action(args => {
            if (args.youdao || Object.values(args).some(item => item.length)) {
                setAuthorizationKey(args);
            }
        });

    config
        .command('get')
        .description(`get ${name} config`)
        .option('--youdao, youdao', `Get a local secret key`)
        .option('--deepl, deepl', `Get the local deepl secret key`)
        .action(async args => {
            const result = await getLocalConfiguration(args);
            logger.done(result);
        });

    return config;
}

module.exports = makeConfigCommand;
