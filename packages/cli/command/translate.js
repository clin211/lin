const { validate, chalk } = require('@clin211/cli-utils');
const translate = require('../lib/translate');

module.exports = program => {
    program
        .command('t [letters...]')
        .usage('lin t <translate text> [options]')
        .description(
            `Translate a text using deepl, support language target: ${chalk.blueBright(
                validate.languageTarget.join(', '),
            )}`,
        )
        .option('-l, --languageTarget <string>', `support language target`, validate.verifyLanguage)
        .option(
            `--use, use <string>`,
            `What tools to use for translation, default use ${chalk.blueBright(
                'deepl',
            )}, format: ${chalk.blueBright('lin t <translate text> --use <youdao or deepl>')}`,
            validate.verifyNotNull,
        )
        .action(async (text, args) => {
            text = text.toString().split(',').join(' ');

            if (!text) {
                chalk.redBright('Text to be translated cannot be empty!');
                process.exit(-1);
            }
            await translate(text, args);
        });
};
