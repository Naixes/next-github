import { useState, useCallback } from 'react'
import { Avatar, Button, Select, Spin } from 'antd'
import dynamic from 'next/dynamic'

import WithRepoBasic from '../../components/with-repo-basic'
import { request } from '../../lib/api'
import { getLastUpdated } from '../../lib/utils'

const MDRender = dynamic(() => import('../../components/MarkdownRender'), {
  loading: () => <p>Loading</p>
})

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MDRender content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          打开issue讨论页面
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fafafa;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  )
}

function Label({ label }) {
  return (
    <>
      <div className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </div>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px;
          border-radius: 3px;
          font-size: 14px;
        }
      `}</style>
    </>
  )
}

const IssueItem = function({issue}) {
    const [showDetail, setShowDetail] = useState(false)

    // 这个写法就可以不依赖showDetail，可以避开闭包
    const toggleShowDetail = useCallback(() => {
      setShowDetail(detail => !detail)
    }, [])
  
    // const toggleShowDetail = useCallback(() => {
    //   setShowDetail(!showDetail)
    // }, [showDetail])

    return (
        <div>
            <div className="issue">
                <Button
                    type="primary"
                    size="small"
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                    }}
                    onClick={toggleShowDetail}
                >
                    {showDetail ? '隐藏' : '查看'}
                </Button>
        
                <div className="avatar">
                <Avatar src={issue.user.avatar_url} shape="square" size={50}></Avatar>
                </div>
                <div className="main-info">
                {/* 标题 */}
                <h6>
                    <span>{issue.title}</span>
                    {issue.labels.map(label => <Label label={label} key={label.id}/>)}
                </h6>
                {/* 时间 */}
                <p className="sub-info">
                    <span>Updated at {getLastUpdated(issue.updated_at)}</span>
                </p>
                </div>
        
                <style jsx>{`
                .issue {
                    display: flex;
                    position: relative;
                    padding: 10px;
                }
                .issue:hover {
                    background: #fafafa;
                }
                .issue + .issue {
                    border-top: 1px solid #eee;
                }
                .main-info > h6 {
                    max-width: 600px;
                    font-size: 16px;
                    padding-right: 40px;
                }
                .avatar {
                    margin-right: 20px;
                }
                .sub-info {
                    margin-bottom: 0;
                }
                .sub-info > span + spa n {
                    display: inline-block;
                    margin-left: 20px;
                    font-size: 12px;
                }
                `}</style>
            </div>
            {showDetail ? <IssueDetail issue={issue} /> : null}
        </div>
    )
}

const Issues = ({ initialIssues, labels, owner, name }) => {
    const [issues, setIssues] = useState(initialIssues)

    return (
        <div className="root">
            {/* <div className="search">
                <SearchUser onChange={handleCreatorChange} value={creator} />
                <Select
                placeholder="状态"
                onChange={handleStateChange}
                value={state}
                style={{ width: 200, marginLeft: 20 }}
                >
                <Option value="all">all</Option>
                <Option value="open">open</Option>
                <Option value="closed">closed</Option>
                </Select>
                <Select
                mode="multiple"
                placeholder="Label"
                onChange={handleLabelChange}
                value={label}
                style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
                >
                {labels.map(la => (
                    <Option value={la.name} key={la.id}>
                    {la.name}
                    </Option>
                ))}
                </Select>
                <Button type="primary" onClick={handleSearch} disabled={fetching}>
                搜索
                </Button>
            </div> */}
          {/* {fetching ? (
            <div className="loading">
              <Spin />
            </div>
          ) : ( */}
            <div className="issues">
              {issues.map(issue => (
                <IssueItem issue={issue} key={issue.id}></IssueItem>
              ))}
            </div>
          {/* )} */}
          <style jsx>{`
            .issues {
              border: 1px solid #eee;
              border-radius: 5px;
              margin-bottom: 20px;
              margin-top: 20px;
            }
            .search {
              display: flex;
            }
            .loading {
              height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}</style>
        </div>
    )
}

Issues.getInitialProps = async({ctx}) => {
    const {owner, name} = ctx.query

    const fetchs = await Promise.all([
        await request(
            {url: `/repos/${owner}/${name}/issues`},
            ctx.req,
            ctx.res
        ),
        await request(
            {url: `/repos/${owner}/${name}/labels`},
            ctx.req,
            ctx.res
        )
    ])
    const [IssuesResp, labelsResp] = fetchs

    return {
        owner,
        name,
        initialIssues: IssuesResp.data,
        labels: labelsResp.data
    }
}

export default WithRepoBasic(Issues, 'issues')