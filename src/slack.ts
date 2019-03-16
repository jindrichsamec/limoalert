import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { getEnvVariable } from '@brandembassy/be-javascript-utils'
import { createFetchJsonWithLogger } from '@brandembassy/be-javascript-utils/dist/fetchJson/requestLogger'
import { AuthPayload } from './types'

export const fetchJsonWithLogger: (...args: Array<any>) => Promise<any> = createFetchJsonWithLogger(console)

const OAUTH_CLIENT_ID = getEnvVariable('OAUTH_CLIENT_ID')
const OAUTH_CLIENT_SECRET = getEnvVariable('OAUTH_CLIENT_SECRET')
const SLACK_CHANNEL = getEnvVariable('SLACK_CHANNEL')
const SLACK_LIMOBOSS_MEMBER = getEnvVariable('SLACK_LIMOBOSS_MEMBER')

export function createSlackAuthUrl(clientId: string, redirectUri: string): string {
  return `https://slack.com/oauth/authorize?client_id=${clientId}&scope=chat:write:user&redirect_uri=${redirectUri}`
}

export async function sendMessage(limo: string, token: string) {
  const url = 'https://slack.com/api/chat.postMessage'
  const body = {
    channel: SLACK_CHANNEL,
    text: `Hey <@${SLACK_LIMOBOSS_MEMBER}> ! Beru si :${limo}:`,
    as_user: true,
    link_names: true
  }
  const payload = await fetchJsonWithLogger('Sending message to slack', url, 'POST', body, {
    Authorization: `Bearer ${token}`
  })
  if (payload.ok !== true) {
    throw new Error('Sending message failed')
  }
}

export async function fetchAccessToken(code: string, redirectUri: string): Promise<string> {
  const params = new URLSearchParams();
  params.append('client_id', OAUTH_CLIENT_ID)
  params.append('client_secret', OAUTH_CLIENT_SECRET)
  params.append('code', code)
  params.append('redirect_uri', redirectUri)

  const url = 'https://slack.com/api/oauth.access'
  const response = await fetch(url, {
    method: 'POST',
    body: params
  })

  const payload: AuthPayload = await response.json()
  console.info('response', payload)
  if (payload.ok !== true) {
    throw new Error('Fetching accessToken failed')
  }
  return payload.access_token
}


