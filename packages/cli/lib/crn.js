const inquirer = require('inquirer');
const { run, spinner, logger, request, chalk, isExist } = require('@clin211/cli-utils');

const prompt = inquirer.createPromptModule();

async function questions() {
    try {
        const tags = await request.getTagList('facebook/react-native');
        const versions = tags
            .filter(item => {
                if (!item.name.includes('-rc')) {
                    return item.name;
                }
            })
            .slice(0, 10);

        const templates = [
            'react-native-template-typescript',
            '@native-base/react-native-template',
            '@native-base/react-native-template-typescript',
            'none',
        ];

        const answers = await prompt([
            {
                type: 'list',
                loop: false,
                name: 'version',
                message: 'create a React Native project with a specified version',
                choices: versions,
            },
            {
                type: 'list',
                loop: false,
                name: 'template',
                message: 'Select a React Native project template',
                choices: templates,
            },
        ]);

        const { version, template } = answers;
        return {
            version,
            template: template === templates[templates.length] ? undefined : template,
        };
    } catch (error) {
        logger.error(error);
    }
}

async function createProject(name, options) {
    const { version, template } = options;
    let command = `npx react-native init ${name}`;

    if (version) {
        command += ` version ${version}`;
    }

    if (template) {
        command += ` --template ${template}`;
    }
    logger.info(command);
    spinner.start(chalk.blueBright(`Creating a React Native project\n\n`));
    const result = await run(command);
    const success = chalk.blueBright(
        `Run instructions for Android` + result.stdout.split('Run instructions for Android')[1],
    );
    logger.done(success);
    spinner.successSpinner('created React Native project');
}

module.exports = async (name, options) => {
    const projectIsExist = await isExist(name, options);
    if (!projectIsExist) {
        const answers = await questions();
        await createProject(name, answers);
    }
};
