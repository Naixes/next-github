import {withRouter} from 'next/router'
import Link from 'next/link'
import {useEffect} from 'react'

import {request} from '../lib/api'
import Repo from '../components/Repo'
import {cache, get} from '../lib/repo-basic-cache'

const makeQuery = function(queryObj) {
    // console.log('entries', Object.entries(queryObj));
    const query = Object.entries(queryObj).reduce((result, entry) => {
        result.push(entry.join('='))
        return result
    }, []).join('&')
    return `?${query}`
}

const isServer = typeof window === 'undefined'

// type：标记当前的tab
export default (Comp, type="index") => {
    const withRepoBasic = ({repoBasic, router, ...rest}) => {
        // 拼接路由参数
        const query = makeQuery(router.query)

        // 缓存
        useEffect(() => {
            !isServer && cache(repoBasic)
        }, []);

        return (
            <div className="root">
              <div className="repo-basic">
                <Repo repo={repoBasic} />
                <div className="tabs">
                  {type === 'index' ? (
                    <span className="tab index">Readme</span>
                  ) : (
                    <Link href={`/detail${query}`}>
                      <a className="tab index">Readme</a>
                    </Link>
                  )}
                  {type === 'issues' ? (
                    <span className="tab issues">Issues</span>
                  ) : (
                    <Link href={`/detail/issues${query}`}>
                      <a className="tab issues">Issues</a>
                    </Link>
                  )}
                </div>
              </div>
              <div>
                <Comp {...rest} />
              </div>
              <style jsx>{`
                .root {
                  padding-top: 20px;
                }
                .repo-basic {
                  padding: 20px;
                  border: 1px solid #eee;
                  margin-bottom: 20px;
                  border-radius: 5px;
                }
                .tab + .tab {
                  margin-left: 20px;
                }
              `}</style>
            </div>
        )
    }

    withRepoBasic.getInitialProps = async context => {
        const {ctx} = context
        const {owner, name} = ctx.query
        const full_name = `${owner}/${name}`

        let pageData = {}
        if(Comp.getInitialProps) {
            pageData = await Comp.getInitialProps(context)
        }

        // 判断是否有缓存
        if(get(full_name)) {
            return {
                repoBasic: get(full_name),
                ...pageData
            }
        }

        const repoBasicRes = await request(
            { url: `/repos/${owner}/${name}` },
            ctx.req,
            ctx.res
        )
        return {
            repoBasic: repoBasicRes.data,
            ...pageData
        }
    }

    return withRouter(withRepoBasic)
}