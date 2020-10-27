const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const client_id = '1450fe58e8ab884ca9ce'
const SCOPE = 'user'

module.exports = {
    github: {
        request_token_url: 'https://github.com/login/oauth/access_token',
        client_id,
        client_secret: 'e4bc52bdcbb57c2359ba149123178f26ba431e8f'
    },
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}