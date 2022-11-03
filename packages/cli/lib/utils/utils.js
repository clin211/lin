const {
    fs,
    logger,
    configPath,
    defaultSortJson,
    chalk,
    inquirer,
    trim,
} = require('@clin211/cli-utils');
const { YOUDAO_AUTHORIZATION_KEY, DEEPL_AUTHORIZATION_KEY, USE_TRANSLATE } = require('./constant');

// check the secret keys of Youdao or deepl
async function checkAuthorizationKey() {
    // check whether the configuration file exists
    if (!fs.existsSync(configPath)) {
        logger.error(`Please configure deepl or Youdao secret key first`);
        process.exit(-1);
    }

    // read file
    const content = fs.readFileSync(configPath).toString();

    if (content.length <= 1) return Promise.resolve(false);

    const parse = JSON.parse(content);

    if (parse[YOUDAO_AUTHORIZATION_KEY] || parse[DEEPL_AUTHORIZATION_KEY]) {
        return Promise.resolve(true);
    }

    return Promise.resolve(false);
}

// configure deepl or Youdao secret key
async function setAuthorizationKey(options) {
    console.log('options:', options);
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, '{}');
    }

    // read file
    let content = fs.readFileSync(configPath).toString();

    // if it exists, the content is resolved
    if (content.length > 1) {
        content = JSON.parse(content);
    }
    const data = {};

    if (options.youdao) {
        console.log('youdao:', options.youdao);
        const prompt = inquirer.createPromptModule();
        const answer = await prompt([
            {
                type: 'input',
                name: 'key',
                message: 'Please enter the app key of Youdao',
                filter(value) {
                    return trim(value);
                },
            },
            {
                type: 'input',
                name: 'secret',
                message: 'Please enter the app secret of YauDao',
                filter(value) {
                    return trim(value);
                },
            },
        ]);
        console.log('answer:', answer);
        data[YOUDAO_AUTHORIZATION_KEY] = answer;
    }

    if (options.deepl) {
        data[DEEPL_AUTHORIZATION_KEY] = options.deepl;
    }

    if (options.use) {
        data[USE_TRANSLATE] = options.use;
    }

    // sort
    content = defaultSortJson(Object.assign(content, data));

    // write config
    fs.writeFileSync(configPath, JSON.stringify(content));
}

async function getLocalConfiguration(options) {
    if (!fs.existsSync(configPath)) {
        return Promise.resolve(chalk.yellowBright(`You don't have any configuration yet!`));
    }

    const { youdao, deepl, use } = options;

    // read config file
    const result = fs.readFileSync(configPath).toString();

    if (result.length <= 1) return Promise.resolve('the configuration file is empty!');

    // parse result
    const content = JSON.parse(result);

    // if no fetch is specified, all are returned
    if (!youdao || !deepl) {
        return Promise.resolve(JSON.stringify(content, null, 4));
    }

    // specifies the secret key that returns Youdao
    if (youdao) {
        return Promise.resolve(content[YOUDAO_AUTHORIZATION_KEY]);
    }

    // specifies the secret key to return deepl
    if (deepl) {
        return Promise.resolve(content[DEEPL_AUTHORIZATION_KEY]);
    }

    // configure the default translation tool
    if (use) {
        return Promise.resolve(content[USE_TRANSLATE]);
    }

    return Promise.resolve(content);
}

module.exports = {
    setAuthorizationKey,
    checkAuthorizationKey,
    getLocalConfiguration,
};
