const fs = require('fs');
const chalk = require('chalk');
const tinify = require('tinify');
const ora = require('ora');
const { pathExistsSync } = require('fs-extra');
const { configPath, logger, inquirer } = require('@clin211/cli-utils');
const { TINIFY_AUTHORIZATION_KEY } = require('../utils/constant');

const spinner = ora(`Loading ${chalk.green('unicorns\n')}`);
spinner.color = 'green';
spinner.spinner = 'aesthetic';

// images zipped
async function zipped(filePath, output) {
    spinner.text = 'zipping......';
    checkAuthorization();
    if (fs.statSync(filePath).isDirectory()) {
        const files = fs.readdirSync(filePath);
        spinner.color = 'green';
        spinner.text = 'read directory successfully';
        for (const file of files) {
            const content = fs.readFileSync(`${filePath}/${file}`);
            spinner.text = 'read file successfully';
            tinify.fromBuffer(content).toBuffer(async (err, resultData) => {
                if (err) throw err;
                spinner.text = 'writing...';
                const outputPathFile = `${output}/${file}`;
                if (pathExistsSync(outputPathFile)) {
                    let { action } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'action',
                            message: 'Target directory already exists Pick an action:',
                            choices: [
                                {
                                    name: 'Overwrite',
                                    value: 'overwrite',
                                },
                                {
                                    name: 'Cancel',
                                    value: false,
                                },
                            ],
                        },
                    ]);

                    if (action === 'overwrite') {
                        logger.info(chalk.blueBright(`Removing...`));
                        await fs.remove(outputPathFile);
                    }
                }
                fs.writeFileSync(outputPathFile, resultData, 'utf8');
            });
        }
    }

    if (fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath);
        spinner.color = 'green';
        spinner.text = 'read file successfully';
        const filename = filePath.split('/').slice(-1)[0];
        spinner.text = 'get filename successfully';
        tinify.fromBuffer(content).toBuffer((err, resultData) => {
            if (err) throw err;
            spinner.text = 'writing...';
            fs.writeFileSync(`${output}/${filename}`, resultData, 'utf8');
        });
    }
    spinner.succeed('zipped');
}

// images convert
async function convertImage(filePath, output, format) {
    spinner.start('image converting......');
    checkAuthorization();
    if (fs.statSync(filePath).isDirectory()) {
        const files = fs.readdirSync(filePath);
        spinner.color = 'green';
        spinner.text = 'read directory successfully';
        for (const file of files) {
            const content = fs.readFileSync();
            tinify.fromBuffer(content).toBuffer((err, resultData) => {
                if (err) throw err;
                fs.writeFileSync(`${output}/${file}`, resultData, 'utf8');
            });
            const source = tinify.fromFile(`${filePath}/${file}`);
            const converted = source.convert({
                type: [`image/${format}`],
            });
            const extension = await converted.result().extension();
            converted.toFile(`${output}/${file}.${extension}`);
        }
    } else {
        const source = tinify.fromFile(filePath);
        const filename = filePath.split('/').slice(-1)[0];
        const converted = source.convert({ type: [`image/${format}`] });
        const extension = await converted.result().extension();
        converted.toFile(`${output}/${filename}.${extension}`);
    }

    spinner.succeed('convert image completed');
}

// error handler
function error(err) {
    if (!err) return;
    const message = {};

    if (err instanceof tinify.AccountError) {
        message.error = `There was a problem with your API key or with your API account. Your request could not be authorized.`;
        message.name = err.name;
        message.message = err.message;
    }

    if (err instanceof tinify.ClientError) {
        message.error = `The request could not be completed because of a problem with the submitted data.`;
        message.name = err.name;
        message.message = err.message;
    }

    if (err instanceof tinify.ServerError) {
        message.error = `The request could not be completed because of a temporary problem with the Tinify API.`;
        message.name = err.name;
        message.message = err.message;
    }

    if (err instanceof tinify.ConnectionError) {
        message.error = `The request could not be sent because there was an issue connecting to the Tinify API.`;
        message.name = err.name;
        message.message = err.message;
    }

    if (!message.error) {
        message.error = 'other error!';
        message.name = err.name;
        message.message = err.message;
    }

    throw new Error(JSON.stringify(message, null, 4));
}

// check authorization
const checkAuthorization = () => {
    spinner.start('read local config\n');
    const localAuthorization = JSON.parse(fs.readFileSync(configPath));
    const tinifyKey = localAuthorization[TINIFY_AUTHORIZATION_KEY];
    if (!tinifyKey) {
        throw new Error(
            `Please set the secret key of tinify first, command: ${chalk.blackBright(
                'lin config set --tinify <tinify key>',
            )}`,
        );
    }
    tinify.key = tinifyKey;
    tinify.validate(error);
};

module.exports = {
    zipped,
    convertImage,
};
