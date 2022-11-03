const { logger } = require('@clin211/cli-utils');
const crn = require('../lib/create-react-native');

module.exports = program => {
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
};
