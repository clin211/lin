const { Command } = require('commander');
const { dayjs, chalk } = require('@clin211/cli-utils');

module.exports = () => {
    const times = new Command('time');
    times.description(`Time-related functions`);

    // image zipped
    times
        .command('f')
        .description('time stamp conversion')
        .action(async (_, options) => {
            let param = options.args.toString();
            if (!param) {
                chalk.redBright('The timestamp to be converted cannot be empty!');
            }
            let time = '';
            if (param.length >= 16) {
                time = dayjs(Math.round(param / 1000)).format('YYYY-MM-DD HH:mm:ss');
            } else if (param.length >= 10) {
                time = dayjs.unix(param).format('YYYY-MM-DD HH:mm:ss');
            } else {
                throw new Error('Please pass in the correct timestamp');
            }
            console.log(chalk.greenBright('time:', time));
        });

    times
        .command('now')
        .description('get the current timestamp')
        .action(() => {
            console.log(chalk.greenBright('time:', dayjs().unix()));
        });

    return times;
};
