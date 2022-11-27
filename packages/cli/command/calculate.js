const { logger } = require('@clin211/cli-utils');

module.exports = program => {
    program
        .command('calc <expression>')
        .description('Quadratic operations')
        .action(expression => {
            if (!expression) {
                // eslint-disable-next-line no-undef
                throw new Error(logger.error(`missing required argument 'app-name'`));
            }
            console.log('result: ', eval(expression));
        });
};
