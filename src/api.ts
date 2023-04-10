import { URL } from 'url'

export module HTTP {
  export enum Method {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT'
  }
}

export async function perform(method: HTTP.Method, path: string, options?: any) {
  const _headers = options&&options.headers ? options.headers : {}
  //@ts-ignore
  const headers = new Headers(_headers)
  headers.append('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`)
  //@ts-ignore
  return fetch(new URL(path, process.env.GITHUB_API_URL).toString(), {
    ...options,
    method,
    headers: headers,
  })
}

export async function performJSON(method: HTTP.Method, path: string, options?: any) {
  try {
    const _headers = options&&options.headers ? options.headers : {}
    //@ts-ignore
    const headers = new Headers(_headers)
    headers.append('Accept', 'application/vnd.github.v3+json')
    return await perform(method, path, options ? {...options, headers} : {headers})
  } catch (err) {
    throw err
  }
}