const ora = require('ora');
const deepl = require('deepl-node');
const CryptoJS = require('crypto-js');
const { logger, fs, configPath, chalk, request } = require('@clin211/cli-utils');
const {
    DEEPL_AUTHORIZATION_KEY,
    YOUDAO_AUTHORIZATION_KEY,
    USE_TRANSLATE,
} = require('../utils/constant');
const { checkAuthorizationKey } = require('../utils/utils');
const { verifyIsZH } = require('@clin211/cli-utils/lib/validate');

const spinner = ora();

async function translation(text, options) {
    spinner.start('read local config\n');
    const localAuthorization = JSON.parse(fs.readFileSync(configPath));
    const useTools = options.use ?? localAuthorization[USE_TRANSLATE];
    const isDeepl = useTools === 'deepl';
    const authorizationKey =
        localAuthorization[isDeepl ? DEEPL_AUTHORIZATION_KEY : YOUDAO_AUTHORIZATION_KEY];

    const defaultTranslate = verifyIsZH(text) ? 'en-US' : 'zh';
    const translatedLanguage = options.languageTarget ?? defaultTranslate;

    // use deepl translation
    if (isDeepl && localAuthorization[DEEPL_AUTHORIZATION_KEY]) {
        spinner.info('use deepl translating!');
        const translator = new deepl.Translator(authorizationKey);
        try {
            const { count } = await (await translator.getUsage()).character;
            spinner.info(chalk.blueBright(`Already translated characters ${count}`));

            const result = await translator.translateText(text, null, translatedLanguage);

            spinner.succeed('translated');

            logger.done(chalk.greenBright(`translation: ${result.text}`));
        } catch (error) {
            logger.error(chalk.redBright(`deepl translator error:`, error));
            process.exit(1);
        }
    } else {
        spinner.info('use youdao translating!');
        try {
            const appKey = authorizationKey.key;
            const key = authorizationKey.secret;
            const salt = new Date().getTime();
            const curtime = Math.round(new Date().getTime() / 1000);
            const str1 = appKey + truncate(text) + salt + curtime + key;
            const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

            const params = {
                appKey,
                salt,
                sign,
                curtime,
                q: text,
                from: 'auto',
                to: 'zh-CHS',
                signType: 'v3',
            };

            const result = await request.axios.get('https://openapi.youdao.com/api', {
                params,
            });

            if (result.data.errorCode !== '0') {
                logger.error('翻译失败');
                process.exit(0);
            }

            spinner.succeed('translated');

            logger.done(chalk.greenBright(`translation: ${result.data.translation.toString()}`));
        } catch (error) {
            logger.error(chalk.redBright(`youdao translator error:`, error));
            process.exit(1);
        }
    }
}

function truncate(q) {
    let len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}

async function translate(text, options) {
    const isAuthorization = await checkAuthorizationKey();

    if (!isAuthorization) {
        logger.error(`please configure deepl or Youdao secret key first`);
        process.exit(0);
    }
    translation(text, options);
}

module.exports = translate;
