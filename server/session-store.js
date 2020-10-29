function getRedisSessionId(sid) {
    return `ssid:${sid}`
}

class RedisSessionStore {
    constructor(client) {
        this.client = client
    }
    // 获取
    async get(sid) {
        const id = getRedisSessionId(sid)
        try {
            const data = await this.client.get(id)
            if(!data) {
                return null
            }
            return JSON.parse(data)
        } catch (error) {
            console.log('RedisSessionStore err: get', error);
        }
    }
    // 设置
    // id，储存值，过期时间
    async set(sid, session, ttl) {
        const id = getRedisSessionId(sid)
        if(typeof ttl === 'number') {
            ttl = Math.ceil(ttl / 1000)
        }
        try {
            const sessionStr = JSON.stringify(session)
            if(ttl) {
                await this.client.setex(id, ttl, sessionStr)
            }else {
                await this.client.set(id, sessionStr)
            }
        } catch (error) {
            console.log('RedisSessionStore err: set', error);
        }
    }
    // 删除
    async destroy(sid) {
        const id = getRedisSessionId(sid)
        try {
            await this.client.del(id)
        } catch (error) {
            console.log('RedisSessionStore err: set', error);
        }
    }
}

module.exports = RedisSessionStore