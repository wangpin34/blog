import { URL } from 'url'
import fetch, { RequestInit, Headers } from 'node-fetch'

export module HTTP {
  export enum Method {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT'
  }
}

export async function perform(method: HTTP.Method, path: string, options?: RequestInit) {
  const _headers = options&&options.headers ? options.headers : {}
  const headers = new Headers(_headers)
  headers.append('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`)
  return fetch(new URL(path, process.env.GITHUB_API_URL).toString(), {
    ...options,
    method,
    headers: headers,
  })
}

export async function performJSON(method: HTTP.Method, path: string, options?: RequestInit) {
  try {
    const _headers = options&&options.headers ? options.headers : {}
    const headers = new Headers(_headers)
    headers.append('Accept', 'application/vnd.github.v3+json')
    return await perform(method, path, options ? {...options, headers} : {headers})
  } catch (err) {
    throw err
  }
}