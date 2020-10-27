const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const client_id = ''
const SCOPE = 'user'

module.exports = {
    github: {
        request_token_url: 'https://github.com/login/oauth/access_token',
        client_id,
        client_secret: ''
    },
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}