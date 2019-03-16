import * as Koa from 'koa'
import { fetchAccessToken, sendMessage, createSlackAuthUrl } from './slack'
import { getEnvVariable } from '@brandembassy/be-javascript-utils';
import * as limoList from './data/limo.json'

const OAUTH_CLIENT_ID = getEnvVariable('OAUTH_CLIENT_ID')
const ACCESS_TOKEN_COOKIE_NAME = getEnvVariable('ACCESS_TOKEN_COOKIE_NAME')
const AWS_API_GATEWAY_STAGE = getEnvVariable('AWS_API_GATEWAY_STAGE', '')
const LIMOALERT_SERVICE_BASE_URL = getEnvVariable('LIMOALERT_SERVICE_BASE_URL')

export async function checkUserToken(ctx: Koa.Context, next: Function) {
  ctx.accessToken = ctx.cookies.get(ACCESS_TOKEN_COOKIE_NAME)
  let userCode = ctx.request.query.code
  console.log('Checking user token and code', ctx.accessToken, userCode)
  const redirectUri = `${LIMOALERT_SERVICE_BASE_URL}${ctx.path}`
  if (userCode) {
    console.log('Request access in slack with code', userCode)
    ctx.accessToken = await fetchAccessToken(userCode, redirectUri)
    console.log('Obtained AccessToken', ctx.accessToken)
    ctx.cookies.set(ACCESS_TOKEN_COOKIE_NAME, ctx.accessToken)
  }
  if (!ctx.accessToken) {
    const slackAuthUrl = createSlackAuthUrl(OAUTH_CLIENT_ID, redirectUri)
    console.log('Redirecting to slack auth', slackAuthUrl)
    ctx.redirect(slackAuthUrl)
    return
  }

  await next()
}

export async function sendMessageToSlack(ctx: Koa.Context, next: Function) {
  const { limo } = ctx.params
  if (!ctx.accessToken) {
    throw new Error('Unknown access token')
  }
  console.log('Sending message to slack with token', ctx.accessToken)
  await sendMessage(limo, ctx.accessToken)
  ctx.redirect(`${LIMOALERT_SERVICE_BASE_URL}/success/${limo}`)

  await next()
}

export async function renderSuccess(ctx: Koa.Context, next: Function) {
  const { limo } = ctx.params
  await ctx.render('success', {
    limo
  })
  ctx.response.status = 200
}

export async function renderLimoList(ctx: Koa.Context, next: Function) {
  await ctx.render('list', {
    limoList,
    LIMOALERT_SERVICE_BASE_URL
  })
  ctx.response.status = 200
}
