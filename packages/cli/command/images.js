const { Command } = require('commander');
const { pathExistsSync, existsSync } = require('fs-extra');
const { validate, chalk } = require('@clin211/cli-utils');
const { zipped, convertImage } = require('../lib/images');

module.exports = () => {
    const images = new Command('image');
    images.description(`Functions related to processing images`);

    // image zipped
    images
        .command('zip')
        .usage('lin image zip -p <image file path> -o <output file path>')
        .description('image compression')
        .option('-p, --path <path>', 'file path', validate.verifyImageFile)
        .option('-o, --output <path>', 'file output path', validate.isNullOrNotString)
        .option('-f, --force', 'overwrite target directory if it exist')
        .action(async args => {
            const { path, output } = args;
            if (!pathExistsSync(path)) {
                throw new Error(chalk.red('file does not exist!'));
            }
            zipped(path, output);
        });

    const formatType = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'GIF', 'JPG', 'PNG', 'WEBP'];
    function verifyImageType(value) {
        if (!value) {
            throw new Error(chalk.red('The file format to be converted cannot be empty!'));
        }
        if (!formatType.includes(value)) {
            throw new Error(
                chalk.red(`Please enter a valid image format, Support: ${formatType.toString()}`),
            );
        }
        return value;
    }

    // image convert
    images
        .command('convert')
        .description(`Image conversion format support: ${chalk.blueBright(formatType)}`)
        .option('-p, --path <path>', 'file path', validate.verifyImageFile)
        .option('-o, --output <path>', 'file output path', validate.isNullOrNotString)
        .option('-f, --format <format>', 'convert file format', verifyImageType)
        .action(async args => {
            const { path, output, format } = args;
            if (!existsSync(path)) {
                throw new Error(chalk.red('file does not exist!'));
            }
            convertImage(path, output, format);
        });

    return images;
};
