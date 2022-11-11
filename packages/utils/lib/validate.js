const { chalk } = require('chalk');
const { exit } = require('./exit');

const trim = value => {
    return value.replace(/(^\s*)|(\s*$)/g, '');
};

// proxy to joi for option validation
const createSchema = fn => {
    const joi = require('joi');

    let schema = fn(joi);
    if (typeof schema === 'object' && typeof schema.validate !== 'function') {
        schema = joi.object(schema);
    }

    return schema;
};

const validate = (obj, schema, cb) => {
    const { error } = schema.validate(obj);
    if (error) {
        cb(error.details[0].message);

        if (process.env.VUE_CLI_TEST) {
            throw error;
        } else {
            exit(1);
        }
    }
};

const validateSync = (obj, schema) => {
    const { error } = schema.validate(obj);
    if (error) {
        throw error;
    }
};

const languageTarget = [
    'bg',
    'cs',
    'da',
    'de',
    'el',
    'es',
    'et',
    'fi',
    'fr',
    'hu',
    'id',
    'it',
    'ja',
    'lt',
    'lv',
    'nl',
    'pl',
    'ro',
    'ru',
    'sk',
    'sl ',
    'sv',
    'tr',
    'uk',
    'zh',
    'en-GB',
    'en-US',
    'pt-BR',
    'pt-PT',
];

const verifyLanguage = value => {
    value = trim(value);
    if (!value) {
        throw new Error(chalk.red('The conversion language cannot be null!'));
    }

    if (!languageTarget.includes(value)) {
        throw new Error(
            chalk.red(`Please enter a valid language, support: ${languageTarget.toString()}`),
        );
    }
    return trim(value);
};

const verifyNotNull = value => {
    value = trim(value);
    if (!value) {
        throw new Error(chalk.red('The conversion language cannot be null!'));
    }
    return value;
};

const verifyIsZH = value => {
    const regexp = /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/;
    return regexp.test(value);
};

const verifyImageFile = value => {
    const ext = ['.jpg', '.jpeg', '.png', '.GIF', '.JPG', '.PNG', '.webp'];
    if (ext.filter(item => value.endsWith(item)).length <= 0) {
        throw new Error('Upload supported files!');
    }
    return value;
};

const isNullOrNotString = value => {
    if (!value) {
        throw new Error('Parameters cannot be empty!');
    }
    if (typeof value !== 'string') {
        throw new Error('The parameter must be a string!');
    }
    return value;
};

module.exports = {
    validate,
    validateSync,
    createSchema,
    languageTarget,
    verifyLanguage,
    verifyNotNull,
    verifyIsZH,
    verifyImageFile,
    isNullOrNotString,
};
