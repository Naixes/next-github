const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const client_id = '1450fe58e8ab884ca9ce'
const SCOPE = 'user'

module.exports = {
    github: {
        request_token_url: 'https://github.com/login/oauth/access_token',
        client_id,
        client_secret: '49ec227fa4fb8fe4d7fa9dbc782c976370cba1dd'
    },
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}