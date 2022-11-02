const axios = require('axios');

const request = {
    async get(url, opts) {
        const options = {
            method: 'GET',
            timeout: 30000,
            ...opts,
        };
        const result = await axios(url, options);
        return result.data;
    },
};

const getTagList = async repo => {
    const result = await request.get(`https://api.github.com/repos/${repo}/tags`);
    return result;
};

module.exports = { request, getTagList };
