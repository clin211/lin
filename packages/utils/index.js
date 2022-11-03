const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const fs = require('fs-extra');
const semver = require('semver');
const inquirer = require('inquirer');
const sortJson = require('sort-json');
const env = require('./lib/env');
const exit = require('./lib/exit');
const logger = require('./lib/logger');
const object = require('./lib/object');
const pkg = require('./lib/pkg');
const request = require('./lib/request');
const spinner = require('./lib/spinner');
const validate = require('./lib/validate');

const run = async (command, args, cwd) => {
    if (!args) {
        [command, ...args] = command.split(/\s+/);
    }
    const result = await execa(command, args, { cwd });
    return result;
};

function trim(value) {
    return value.replace(/(^\s*)|(\s*$)/g, '');
}

function trimLeft(value) {
    return value.replace(/(^\s*)/g, '');
}

function trimRight(value) {
    return value.replace(/(\s*$)/g, '');
}

async function isExist(name, options) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name);

    // 目录是否已经存在？
    if (fs.existsSync(targetAir)) {
        // 是否为强制创建？
        if (options.force) {
            await fs.remove(targetAir);
        } else {
            // 询问用户是否确定要覆盖
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
                // 移除已存在的目录
                logger.info(chalk.blueBright(`Removing...`));
                await fs.remove(targetAir);
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

function defaultSortJson(values, option) {
    const options = { ignoreCase: true, reverse: false, depth: 5, ...option };
    return sortJson(values, options);
}

// obtaining a user directory
const userHome = process.env.HOME || process.env.USERPROFILE;

let configPath = `${userHome}/.lin`;

module.exports = {
    chalk,
    execa,
    fs,
    semver,
    inquirer,
    env,
    exit,
    logger,
    object,
    pkg,
    request,
    spinner,
    validate,
    run,
    isExist,
    trim,
    trimLeft,
    trimRight,
    userHome,
    configPath,
    sortJson,
    defaultSortJson,
};
