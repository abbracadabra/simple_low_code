import { Button, notification } from 'antd';


type FetchOptionType = Omit<RequestInit, 'body'> & {
    query?: Record<string, any>
    body?: BodyInit | Record<string, any> | null
  }

  const baseOptions = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include', // always send cookies、HTTP Basic authentication.
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    redirect: 'follow',
  }

  export type IOtherOptions = {
    bodyStringify?: boolean
  }
// status != 200 or 网络异常 -> reject
export const request = async(url: string, fetchOptions:FetchOptionType = {}, {bodyStringify=true}: IOtherOptions={}) => {
    const options: typeof baseOptions & FetchOptionType = Object.assign({}, baseOptions, fetchOptions)
    const {  query, body } = options
    let finalUrl = url;
    if (query) {
        const paramsArray: string[] = []
        Object.keys(query).forEach(key =>
          paramsArray.push(`${key}=${encodeURIComponent(query[key])}`),
        )
        if (finalUrl.search(/\?/) === -1) {
            finalUrl += `?${paramsArray.join('&')}`
        } else {
            finalUrl += `&${paramsArray.join('&')}`
        }
        delete options.query
    }

    if (body && bodyStringify) {
        options.body = JSON.stringify(body)
    }

    globalThis.fetch(url, options as RequestInit)
    .then((res) => {
        if (res.status !== 200) {
            return Promise.reject(res)
        }
        return res.json()
    })
}


export const get = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
    return request(url, Object.assign({}, options, { method: 'GET' }), otherOptions) as Promise<T>
  }
  
export const post = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
    return request(url, Object.assign({}, options, { method: 'POST' }), otherOptions) as Promise<T>
}

